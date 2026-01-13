import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export default async function ConfirmEmailPage() {
    const t = await getTranslations("confirmEmail");

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4">
            <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-xl p-8 text-center border border-gray-700">
                {/* 邮件图标 */}
                <div className="mb-6">
                    <div className="mx-auto w-16 h-16 bg-purple-900 rounded-full flex items-center justify-center">
                        <svg 
                            className="w-8 h-8 text-purple-400" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                            />
                        </svg>
                    </div>
                </div>

                {/* 标题 */}
                <h1 className="text-2xl font-bold text-white mb-4">
                    {t("title")}
                </h1>
                
                {/* 描述文本 */}
                <p className="text-gray-300 mb-6 leading-relaxed">
                    {t("description")}
                </p>

                {/* 提示信息 */}
                <div className="bg-purple-900/20 border border-purple-800 rounded-lg p-4 mb-6">
                    <p className="text-sm text-purple-200">
                        💡 {t("tip")}
                    </p>
                </div>

                {/* 行动按钮 */}
                <div className="space-y-3">
                    <Link 
                        href="/"
                        className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                    >
                        {t("returnHome")}
                    </Link>
                    
                    <Link 
                        href="/signin"
                        className="block w-full border border-gray-600 hover:bg-gray-700 text-gray-300 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                    >
                        {t("backToSignIn")}
                    </Link>
                </div>

                {/* 底部提示 */}
                <p className="text-xs text-gray-400 mt-6">
                    {t("needHelp")}
                </p>
            </div>
        </div>
    );
}