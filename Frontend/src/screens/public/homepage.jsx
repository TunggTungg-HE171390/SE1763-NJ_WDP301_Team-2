import { Helmet } from "react-helmet-async";
import Header from "../../components/common/header";
import Footer from "../../components/common/footer";

function Homepage() {
    return (
        <>
            <Helmet>
                <title>Home</title>
            </Helmet>
            <Header />
            <h1>Home Page</h1>
            <Footer />
        </>
    );
}
export default Homepage;
