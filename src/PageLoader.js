import React from "react";
import Loader from "react-loader-spinner";

const PageLoader = () => {
    return (
        <div className="loaderPosition">
            <Loader
            type="Bars"
            color="#5e8047"
            height={100}
            width={100}
            timeout={100000}
            />
        </div>
    )
}

export default PageLoader