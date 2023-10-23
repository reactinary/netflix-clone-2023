// import NextAuth from "next-auth";
// import GithubProvider from "next-auth/providers/github";

// const authOptions = {
//   providers: [
//     GithubProvider({
//       clientId: "Iv1.e7ff710e7445c100",
//       clientSecret: "40efdf0fa3edd9f5462de113aad1df1c441fe6a8",
//     }),
//   ],
//   callbacks: {
//     async session({ session, token, user }) {
//       session.user.username = session?.user?.name
//         .split(" ")
//         .join("")
//         .toLocaleLowerCase();

//       session.user.uid = token.sub;

//       return session;
//     },
//   },
//   secret: "default_secret_key",
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };




import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      session.user.username = session?.user?.name
        .split(" ")
        .join("")
        .toLocaleLowerCase();

      session.user.uid = token.sub;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
