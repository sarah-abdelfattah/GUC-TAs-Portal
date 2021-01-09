var tmp;
if (process.env.NODE_ENV === "production"){
    // here will be the production link
    // tmp = '';
}
else 
    tmp = `http://localhost:5000`;
export const link = tmp;

export function dateFormat(input){
    const date = new Date(input)
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return year + "-" + month + "-" + day;
}