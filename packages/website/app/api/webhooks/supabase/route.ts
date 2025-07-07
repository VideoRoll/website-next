// app/api/webhooks/supabase/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import crypto from 'crypto';
import { emailService } from '@/lib/email/emailService';

// Supabase Webhook 数据类型
interface SupabaseWebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record?: any;
  old_record?: any;
  schema: string;
  timestamp: string;
}

// 验证 Webhook 签名
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export async function POST(request: NextRequest) {
  try {
    // 获取原始请求体
    const payload = await request.text();
    const headersList = headers();
    const signature = headersList.get('x-supabase-signature');
    
    // 验证 Webhook 签名（可选但推荐）
    const webhookSecret = process.env.SUPABASE_WEBHOOK_SECRET;
    if (webhookSecret && signature) {
      const isValid = verifyWebhookSignature(payload, signature, webhookSecret);
      if (!isValid) {
        console.error('Invalid webhook signature');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    }

    // 解析 Webhook 数据
    const data: SupabaseWebhookPayload = JSON.parse(payload);
    
    console.log('Received webhook:', {
      type: data.type,
      table: data.table,
      timestamp: data.timestamp
    });

    // 根据不同的表和操作类型处理邮件发送
    await handleWebhookEvent(data);

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// 处理不同的 Webhook 事件
async function handleWebhookEvent(data: SupabaseWebhookPayload) {
  const { type, table, record, old_record } = data;

  try {
    switch (table) {
      case 'auth.users':
        await handleAuthUsersEvent(type, record, old_record);
        break;
        
      case 'profiles':
        await handleProfilesEvent(type, record, old_record);
        break;
        
      case 'subscriptions':
        await handleSubscriptionsEvent(type, record, old_record);
        break;
        
      case 'orders':
        await handleOrdersEvent(type, record, old_record);
        break;
        
      default:
        console.log(`Unhandled table: ${table}`);
    }
  } catch (error) {
    console.error(`Error handling ${table} event:`, error);
    throw error;
  }
}

// 处理用户认证事件
async function handleAuthUsersEvent(
  type: string,
  record?: any,
  old_record?: any
) {
  switch (type) {
    case 'INSERT':
      // 新用户注册
      if (record && record.email) {
        console.log('New user registered:', record.email);
        
        // 发送欢迎邮件
        await emailService.sendWelcomeEmail(
          record.email,
          record.raw_user_meta_data?.full_name || 'VideoRoll User'
        );
        
        console.log('Welcome email sent to:', record.email);
      }
      break;
      
    case 'UPDATE':
      // 用户信息更新
      if (record && old_record) {
        // 检查邮箱验证状态变化
        if (!old_record.email_confirmed_at && record.email_confirmed_at) {
          console.log('User email verified:', record.email);
          
          // 可以发送邮箱验证成功通知
          await emailService.sendEmail({
            to: record.email,
            subject: '✅ Email Verified Successfully - VideoRoll',
            html: `
              <h2>Email Verification Successful!</h2>
              <p>Your email address has been successfully verified. You now have full access to all VideoRoll features.</p>
              <p><a href="https://videoroll.app/dashboard">Visit Dashboard</a></p>
            `
          });
        }
        
        // 检查密码重置
        if (record.recovery_sent_at && record.recovery_sent_at !== old_record.recovery_sent_at) {
          console.log('Password reset requested for:', record.email);
          // 这里可以记录密码重置请求或发送自定义邮件
        }
      }
      break;
  }
}

// 处理用户档案事件
async function handleProfilesEvent(
  type: string,
  record?: any,
  old_record?: any
) {
  switch (type) {
    case 'INSERT':
      // 新用户档案创建
      console.log('New profile created:', record?.id);
      break;
      
    case 'UPDATE':
      // 档案更新
      if (record && old_record) {
        // 检查重要信息变更
        if (record.subscription_status !== old_record.subscription_status) {
          console.log('Subscription status changed:', {
            user_id: record.id,
            old_status: old_record.subscription_status,
            new_status: record.subscription_status
          });
          
          // 根据订阅状态发送相应邮件
          await handleSubscriptionStatusChange(record);
        }
      }
      break;
  }
}

// 处理订阅事件
async function handleSubscriptionsEvent(
  type: string,
  record?: any,
  old_record?: any
) {
  switch (type) {
    case 'INSERT':
      // 新订阅创建
      if (record) {
        console.log('New subscription created:', record.id);
        await sendSubscriptionConfirmationEmail(record);
      }
      break;
      
    case 'UPDATE':
      // 订阅状态更新
      if (record && old_record && record.status !== old_record.status) {
        console.log('Subscription status updated:', {
          subscription_id: record.id,
          old_status: old_record.status,
          new_status: record.status
        });
        
        await handleSubscriptionStatusUpdate(record, old_record);
      }
      break;
      
    case 'DELETE':
      // 订阅取消
      if (old_record) {
        console.log('Subscription cancelled:', old_record.id);
        await sendSubscriptionCancellationEmail(old_record);
      }
      break;
  }
}

// 处理订单事件
async function handleOrdersEvent(
  type: string,
  record?: any,
  old_record?: any
) {
  switch (type) {
    case 'INSERT':
      // 新订单创建
      if (record) {
        console.log('New order created:', record.id);
        await sendOrderConfirmationEmail(record);
      }
      break;
      
    case 'UPDATE':
      // 订单状态更新
      if (record && old_record && record.status !== old_record.status) {
        console.log('Order status updated:', {
          order_id: record.id,
          old_status: old_record.status,
          new_status: record.status
        });
        
        await handleOrderStatusUpdate(record, old_record);
      }
      break;
  }
}

// 订阅状态变更邮件
async function handleSubscriptionStatusChange(profile: any) {
  // 这里需要获取用户邮箱，可能需要查询数据库
  // 假设 profile 中包含 email 或者 user_id
  const userEmail = profile.email; // 或者通过 user_id 查询
  
  if (!userEmail) return;
  
  switch (profile.subscription_status) {
    case 'active':
      await emailService.sendEmail({
        to: userEmail,
        subject: '🎉 Welcome to VideoRoll Pro!',
        html: `
          <h2>Your VideoRoll Pro subscription is now active!</h2>
          <p>Thank you for upgrading to VideoRoll Pro. You now have access to all premium features.</p>
          <ul>
            <li>Unlimited video downloads</li>
            <li>Advanced video editing tools</li>
            <li>Priority customer support</li>
            <li>Early access to new features</li>
          </ul>
          <p><a href="https://videoroll.app/dashboard">Start using Pro features</a></p>
        `
      });
      break;
      
    case 'cancelled':
      await emailService.sendEmail({
        to: userEmail,
        subject: '😔 We\'ll miss you - VideoRoll Pro Cancelled',
        html: `
          <h2>Your VideoRoll Pro subscription has been cancelled</h2>
          <p>We're sorry to see you go. Your Pro features will remain active until the end of your billing period.</p>
          <p>We'd love to hear your feedback to help us improve.</p>
          <p><a href="https://videoroll.app/feedback">Share your feedback</a></p>
        `
      });
      break;
  }
}

// 发送订阅确认邮件
async function sendSubscriptionConfirmationEmail(subscription: any) {
  // 实现订阅确认邮件逻辑
  console.log('Sending subscription confirmation email for:', subscription.id);
}

// 发送订阅取消邮件
async function sendSubscriptionCancellationEmail(subscription: any) {
  // 实现订阅取消邮件逻辑
  console.log('Sending subscription cancellation email for:', subscription.id);
}

// 发送订单确认邮件
async function sendOrderConfirmationEmail(order: any) {
  // 实现订单确认邮件逻辑
  console.log('Sending order confirmation email for:', order.id);
}

// 处理订单状态更新
async function handleOrderStatusUpdate(order: any, oldOrder: any) {
  // 实现订单状态更新邮件逻辑
  console.log('Handling order status update:', order.id);
}