import "./globals.css";
import ApolloProviderWrapper from "../components/ApolloProviderWrapper";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ApolloProviderWrapper>
          {children}
        </ApolloProviderWrapper>
      </body>
    </html>
  );
}


