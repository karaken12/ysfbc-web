import React, {useEffect, useState} from "react";
import ErrorMessage from "./ErrorMessage";
import {LoadingSpinner} from "./LoadingSpinner";

const AsyncLoader = ({serviceUrl, state, children}) => {
  const [data, setData] = state;

  if (data) {
    return children;
  } else {
    return <AsyncLoaderInt serviceUrl={serviceUrl} setData={setData}/>;
  }
};

const AsyncLoaderInt = (props) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const setData = props.setData;
  const serviceUrl = props.serviceUrl;

  async function fetchData() {
    const res = await fetch(serviceUrl);
    res.json()
      .then(result => {
        setData(result);
      })
      .catch(e => {
        console.log(e);
        setErrorMessage('An error occurred!');
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (errorMessage) {
    return <ErrorMessage message={errorMessage}/>
  } else {
    return <LoadingSpinner/>;
  }
};

export default AsyncLoader;
