import App from "next/app";
import axios from "axios";
import { parseCookies, destroyCookie } from "nookies";
import baseUrl from "../utils/baseUrl";
import { redirectUser } from "../utils/authUser";
import Layout from "../components/Layout/Layout";
import "semantic-ui-css/semantic.min.css";


function MyApp({Component,pagePropsObj}){
    return (
        <Layout {...pagePropsObj}>
            <Component {...pagePropsObj} />
        </Layout>
    );
}
MyApp.getInitialProps = async ({ Component, ctx }) => {
    const { token } = await parseCookies(ctx);
		let pagePropsObj = {};
		console.log("token - ", token);

		console.log("pathname - ", ctx.pathname);
		const protectedRoutes = ctx.pathname === "/";
		if (!token) {
			protectedRoutes && redirectUser(ctx, "/login");
		} else {
			if (Component.getInitialProps) {
				pagePropsObj = await Component.getInitialProps(ctx);
			}
			try {
				const res = await axios.get(`${baseUrl}/api/auth`, {
					headers: { Authorization: token },
				});
				console.log(res.data);
				const { user, userFollowStats } = res.data;
                
				pagePropsObj.user = user;
				pagePropsObj.userFollowStats = userFollowStats;
				// console.log(pagePropsObj);
				console.log("data = " , pagePropsObj);

				if (user) !protectedRoutes && redirectUser(ctx, "/");
			} catch (error) {
				destroyCookie(ctx, "token");
				redirectUser(ctx, "/login");
			}
		}
		return { pagePropsObj };
}
export default MyApp;
