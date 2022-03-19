const videoStatus = Object.freeze({
    Unverified: { label: "Unverified", value: 0 },
    Pending: { label: "Coming soon", value: 1 },
    Accepted: { label: "Ready to rent", value: 2 },
    Rejected: { label: "Rejected", value: 3 }
});
function getLabel(value) {
    return videoStatus.find(vs => vs.value === value).label || "";
}
export default videoStatus;