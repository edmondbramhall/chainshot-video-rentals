import { ethers } from 'ethers'

export default {
    methods: {
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
