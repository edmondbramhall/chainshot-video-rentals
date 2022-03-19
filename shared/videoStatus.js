const videoStatus = Object.freeze({
    Unverified: { label: "Unverified", value: 0 },
    Pending: { label: "Coming soon", value: 1 },
    Accepted: { label: "Ready to rent", value: 2 },
    Rejected: { label: "Rejected", value: 3 }
});
const getStatus = function(value) {
    for (var key in videoStatus) {
        if (videoStatus[key].value === value)
            return videoStatus[key];
    }
    return null;
}
export { videoStatus, getStatus };