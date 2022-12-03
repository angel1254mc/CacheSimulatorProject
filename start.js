const fs = require('fs');
const { workerData } = require('worker_threads');
const {NSetCache, Cache, DirectMapCache, FullyAssociativeCache} = require("./index.js");
const hexToBinary = require('hex-to-binary');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

console.log("Welcome to the Cache Simulator Program");
console.log("Created by: Angel Lopez Pol");
console.log("Created for: CDA3101 w/ Prof. Cheryl Resch");
console.log("\\\\\\\\\\\\\\\\\\\\");
readline.question('Please input the amount of bytes per cache to use for our cache architectures: ', bytesPerCache => {
    bytesPerCache = parseInt(bytesPerCache);
    let addressList;
    let resultsArray = [];
    try {
        const data = fs.readFileSync('./data/gcc.trace', 'utf8');
        const splitted = data.split(' ').filter(address => address.length > 6);
        addressList = splitted;
    } catch (err) {
        console.error(err);
    }
    for (let i = 0; i < 6; i++) {

        let d_map_cache = new DirectMapCache(256*Math.pow(2,i), 1, bytesPerCache, Math.pow(2, 32));
        let full_assoc_cache_FIFO = new FullyAssociativeCache(256*Math.pow(2,i), 1, bytesPerCache, Math.pow(2,32), "FIFO");
        let full_assoc_cache_LRU = new FullyAssociativeCache(256*Math.pow(2,i), 1, bytesPerCache, Math.pow(2,32), "LRU");
        let two_set_associative_FIFO = new NSetCache(128*Math.pow(2,i), 2, bytesPerCache, Math.pow(2, 32), "FIFO");
        let two_set_associative_LRU = new NSetCache(128*Math.pow(2,i), 2, bytesPerCache, Math.pow(2, 32), "LRU");
        let four_set_associative_FIFO = new NSetCache(64*Math.pow(2,i), 4, bytesPerCache, Math.pow(2, 32), "FIFO");
        let four_set_associative_LRU = new NSetCache(64*Math.pow(2,i), 4, bytesPerCache, Math.pow(2, 32), "LRU");
        let eight_set_associative_FIFO = new NSetCache(32*Math.pow(2,i), bytesPerCache, bytesPerCache, Math.pow(2, 32), "FIFO");
        let eight_set_associative_LRU = new NSetCache(32*Math.pow(2,i), bytesPerCache, bytesPerCache, Math.pow(2, 32), "LRU");

        console.log("Running Test on Direct Map Cache...");
        addressList.forEach((address) => {
            let loadResult = d_map_cache.load(hexToBinary(address.substring('2')));
        });

        console.log("Running Test on Fully Associative Cache FIFO...");
        addressList.forEach((address) => {
            let loadResult = full_assoc_cache_FIFO.load(hexToBinary(address.substring('2')));
        });
        console.log("Running Test on Fully Associative Cache LRU...");
        addressList.forEach((address) => {
            let loadResult = full_assoc_cache_LRU.load(hexToBinary(address.substring('2')));
        });

        console.log("Running Test on 2-Set Associative FIFO...");
        addressList.forEach((address) => {
            let loadResult = two_set_associative_FIFO.load(hexToBinary(address.substring('2')));
        });

        console.log("Running Test on 2-Set Associative LRU...");
        addressList.forEach((address) => {
            let loadResult = two_set_associative_LRU.load(hexToBinary(address.substring('2')));
        });

        console.log("Running Test on 4-Set Associative FIFO...");
        addressList.forEach((address) => {
            let loadResult = four_set_associative_FIFO.load(hexToBinary(address.substring('2')));
        });

        console.log("Running Test on 4-Set Associative LRU...");
        addressList.forEach((address) => {
            let loadResult = four_set_associative_LRU.load(hexToBinary(address.substring('2')));
        });

        console.log("Running Test on 8-Set Associative FIFO...");
        addressList.forEach((address) => {
            let loadResult = eight_set_associative_FIFO.load(hexToBinary(address.substring('2')));
        });

        console.log("Running Test on 8-Set Associative LRU...");
        addressList.forEach((address) => {
            let loadResult = eight_set_associative_LRU.load(hexToBinary(address.substring('2')));
        });

        console.log(d_map_cache.getHitRate());
        console.log(two_set_associative_FIFO.getHitRate());
        console.log(two_set_associative_LRU.getHitRate());
        console.log(four_set_associative_FIFO.getHitRate());
        console.log(four_set_associative_LRU.getHitRate());
        console.log(eight_set_associative_FIFO.getHitRate());
        console.log(eight_set_associative_LRU.getHitRate());
        console.log(full_assoc_cache_FIFO.getHitRate());
        console.log(full_assoc_cache_LRU.getHitRate());

        console.log(`Simulation finalized for Cache Size ${Math.pow(2,i)*256*bytesPerCache}`);

        resultsArray.push({
            cache_size: Math.pow(2,i)*256*bytesPerCache,
            data: [
                d_map_cache.getHitRate(), 
                two_set_associative_FIFO.getHitRate(), 
                two_set_associative_LRU.getHitRate(), 
                four_set_associative_FIFO.getHitRate(),
                four_set_associative_LRU.getHitRate(),
                eight_set_associative_FIFO.getHitRate(),
                eight_set_associative_LRU.getHitRate(),
                full_assoc_cache_FIFO.getHitRate(), 
                full_assoc_cache_LRU.getHitRate(),

            ]
        });
    }

    try {
        let data = JSON.stringify(resultsArray, null, 2);
        fs.writeFileSync('hit-rate-data.json', data);

        console.log("hit rates saved to hit-rate-data.json");
    } catch (err) {
        console.error(err)
    }
    
    readline.close();
});  
