
import Script from 'next/script';
import './globals.css';

export const metadata = {
  title: 'Ion App'
};

export default function RootLayout({
  children


}) {
  return (
    <html lang="en" data-ion-id="eyJwYXRoIjoiL1VzZXJzL3NhbXJhYWpiYXRoL2lvbi1zdGFydGVyLW5leHQvc3JjL2FwcC9sYXlvdXQudHN4Iiwic3RhcnRUYWciOnsic3RhcnQiOnsibGluZSI6MTUsImNvbHVtbiI6NH0sImVuZCI6eyJsaW5lIjoyMCwiY29sdW1uIjoxMX19LCJjb21wb25lbnQiOiJSb290TGF5b3V0In0=" data-ion-caller-id="eyJjYWxsZXIiOiJSb290TGF5b3V0IiwiZGVwdGgiOjF9">
      <body data-ion-id="eyJwYXRoIjoiL1VzZXJzL3NhbXJhYWpiYXRoL2lvbi1zdGFydGVyLW5leHQvc3JjL2FwcC9sYXlvdXQudHN4Iiwic3RhcnRUYWciOnsic3RhcnQiOnsibGluZSI6MTYsImNvbHVtbiI6Nn0sImVuZCI6eyJsaW5lIjoxOSwiY29sdW1uIjoxM319LCJjb21wb25lbnQiOiJSb290TGF5b3V0In0=" data-ion-caller-id="eyJjYWxsZXIiOiJSb290TGF5b3V0IiwiZGVwdGgiOjF9">
        {children}
        <Script src="/ion-injection.js" strategy="beforeInteractive" data-ion-id="eyJwYXRoIjoiL1VzZXJzL3NhbXJhYWpiYXRoL2lvbi1zdGFydGVyLW5leHQvc3JjL2FwcC9sYXlvdXQudHN4Iiwic3RhcnRUYWciOnsic3RhcnQiOnsibGluZSI6MTgsImNvbHVtbiI6OH0sImVuZCI6eyJsaW5lIjoxOCwiY29sdW1uIjo3MX19LCJjb21wb25lbnQiOiJSb290TGF5b3V0In0=" data-ion-caller-id="eyJjYWxsZXIiOiJSb290TGF5b3V0IiwiZGVwdGgiOjF9" />
      </body>
    </html>);

}