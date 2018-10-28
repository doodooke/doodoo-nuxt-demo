export default function({ app, route, redirect, req }) {
    if (route.path === "/" || route.matched.length === 0) {
        redirect("/hello");
        return;
    }
}
