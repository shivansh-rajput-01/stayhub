let filters = document.querySelectorAll(".filter");
const filterValues = [
    "trending",
    "rooms",
    "iconic-cities",
    "mountains",
    "amazing-pools",
    "camping",
    "farms",
    "arctic"
];
let i = 0;
for (let filter of filters) {
    const uri = `/listings/filters?infilter=${filterValues[i]}`;
    filter.addEventListener("click", () => {
        window.location.href = uri;
    });
    i++;
}