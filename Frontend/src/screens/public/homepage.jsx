import { Helmet } from "react-helmet-async";

function Homepage() {
    return (
        <>
            <Helmet>
                <title>Home</title>
            </Helmet>
            <h1 className="my-[400px]">Home Page</h1>
        </>
    );
}
export default Homepage;
