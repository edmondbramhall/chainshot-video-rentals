import { ethers } from 'ethers'
//import dayjs from 'dayjs'

export default {
    methods: {
        // formatTimestamp: function(timestamp) {
        //     return dayjs.unix(timestamp).format("YYYY-MM-DD hh:mm:ss");
        // },
        shortenHex: function(hex) {
            if (hex === null) return "";
            return `${hex.substring(0, 4)}...${hex.substring(hex.length-4)}`;
        },
        weiToEther: function(wei) {
            const ether = ethers.utils.formatEther(wei);
            return parseFloat(ether).toFixed(2);      
        }        
    }
}
