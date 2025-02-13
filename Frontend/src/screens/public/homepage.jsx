import { Helmet } from "react-helmet-async";

function Homepage() {
    return (
        <>
            <Helmet>
                <title>Home</title>
            </Helmet>
            <h1 className="my-[600px]">Home Page</h1>
        </>
    );
}
export default Homepage;
