import Link from 'next/link';

import {redirect} from 'next/navigation';

// This page only renders when the app is built statically (output: 'export')
export default function HomePage() {
  redirect('/en/docs');
}

// export default function HomePage() {
  
//   return (
//     <main className="flex flex-1 flex-col justify-center text-center">
//       <h1 className="mb-4 text-2xl font-bold">Hello World</h1>
//       <p className="text-fd-muted-foreground">
//         You can open{' '}
//         <Link
//           href="/docs"
//           className="text-fd-foreground font-semibold underline"
//         >
//           /docs
//         </Link>{' '}
//         and see the documentation.
//       </p>
//     </main>
//   );
// }
