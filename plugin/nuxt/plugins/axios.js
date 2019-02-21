import { Message } from "element-ui";

export default function({ app, $axios, redirect, req }) {
    $axios.onRequest(config => {
        console.log("onRequest");
    });

    $axios.onResponse(response => {
        console.log("onResponse");

        if (response.data && response.data.errcode) {
            Message.error(response.data.errmsg);
        }
    });

    $axios.onError(error => {
        console.log("onError");
        console.log(error);
    });

    $axios.onRequestError(err => {
        console.log("onRequestError");
    });
    $axios.onResponseError(err => {
        console.log("onResponseError");
    });
}
