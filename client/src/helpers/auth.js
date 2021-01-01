
async function auth(types) {
    const user = localStorage.getItem("user");

    let found;
    if (user.type === "Academic Member")
        found = types.includes(user.role);
    else
        found = types.includes(user.type);

    if (found)
        return true;
    else {
        document.location.href = '/unauthorized'
    }
}

export default auth;