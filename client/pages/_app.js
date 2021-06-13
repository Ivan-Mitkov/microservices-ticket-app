import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../components/header";
function MyApp({ Component, pageProps, currentUser }) {
  console.log(currentUser);
  return (
    <>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </>
  );
}
//If getInitialProps in _app the same function in other pages is not automaticaly invoked
MyApp.getInitialProps = async (appContext) => {
  // console.log("context: ", context);
  const client = buildClient(appContext.ctx);
  const { data } = await client.get("/api/users/currentuser");
  //manualy invoke getInitialProps in Components for individual pages
  let pageProps = {};
  //if there is getInitialProps in pages 
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  }
  return {
    pageProps,
    ...data,
  };
};
export default MyApp;
