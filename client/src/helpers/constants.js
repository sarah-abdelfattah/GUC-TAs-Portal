var tmp;
if (process.env.NODE_ENV === "production"){
    // here will be the production link
    // tmp = '';
}
else 
    tmp = `http://localhost:5000`;
export const link = tmp;