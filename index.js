class Cache {
    /**
     * Parameters provided
     * Num of sets in a cache
     * Num of Blocks in a set
     * Num of Bytes in a block
     * 
     * We can alter the amount of blocks in a set, and the amount of sets
     * to emulate a different type of cache
     */
    constructor(num_sets = 2, num_blocks = 2, num_bytes_per_block = 4, main_memory_size = 2^32) {
        this.num_sets = num_sets;
        this.num_blocks = num_blocks;
        this.num_bytes = num_bytes_per_block;
        this.main_memory_size = main_memory_size;
    }
}

class DirectMapCache {
    constructor(num_sets, num_blocks, num_bytes_per_block, main_memory_size = Math.pow(2, 32)) {
        this.num_sets = num_sets;
        this.num_blocks = num_blocks;
        this.num_bytes = num_bytes_per_block;
        this.main_memory_size = main_memory_size;

        //Line field size is the log(base2) of cache size divided by line size, which
        // is the same as number of lines in the cache, which is also the same as
        // the number of sets * num of blocks (num of sets in direct map is n and num of blocks/set is 1)
        this.line_field_size = Math.log2(num_blocks * num_sets);
        // offset field size is the log(base2) of the size in bytes of a line/block
        this.offset_field_size = Math.log2(num_bytes_per_block);
        // The width of the tag field is the bits in main memory address, minus the Line Width and Offset Width!
        this.tag_width  = Math.log2(main_memory_size) - this.offset_field_size - this.line_field_size;

        // We should also keep track of the hit count and miss count
        this.hit_count = 0;
        this.miss_count = 0;
        
        // Finally, we know the direct mapped cache has an address format of 
        // [ tag ] [ line ] [ offset ]
        // [ block number ] is also tag + line

        // How might we represent a direct map cache using javascript data structures?
        // Since we directly map a block numbeer to a line#, we could use a vector where the index corresponds to
        // the line number :)
        
        this.cache = []
        for (let i = 0; i < this.num_sets; i++)
            this.cache.push({
                tag: -1,
                counter: 0,
            }); 
        // Insert an "empty" object as a placeholder!
        // We will use array.splice to perform most of our operations on the array
        /**
         * Each object will have         
         * Tag: that denotes the tag field of the address
         * Counter: that keeps track of how frequently this element is hit
         */
        this.parseAddress = (address) => {
            let splitAddress = {
                tag: parseInt(address.substring(0, this.tag_width), 2),
                block: parseInt(address.substring(this.tag_width, this.tag_width + this.line_field_size), 2),
                offset: parseInt(address.substring(this.tag_width + this.line_field_size), 2),
            }
            return splitAddress;
        }
        this.load = (address) => {
            // convert the address from hex to binary
            // some function
            // Split the address into tag, line, and offset. The "line" field contains our block number, which we need to turn into our line
            const {tag, block, offset} = this.parseAddress(address);
            // Use block % num_blocks (lines in cache)
            let line = block % num_sets;
            // Check line to see if tag matches
            if (this.cache[line].tag === tag) {
                this.cache[line].counter++;
                this.hit_count++;
                return true;
            }
            // if tag does not match, simply replace it as per direct map functionality
            
            this.cache.splice(line, 1, {
                tag: tag,
                counter: 0,
            });
            this.miss_count++;

            // For the purposes of this assignment, we don't really need to care about using offset (as mentioned in the video) but it would be cool to implement it
            // for a sort of visualizer
            
            return false;
        }
        this.getHitRate = () => {
            return this.hit_count/(this.hit_count+ this.miss_count)
        }
    }


}

class FullyAssociativeCache {
    constructor(num_sets = 1, num_blocks = 8, num_bytes_per_block = 4, main_memory_size = Math.pow(2, 32), replacement_policy = "FIFO") {
        this.num_sets = num_sets;
        this.num_blocks = num_blocks;
        this.num_bytes = num_bytes_per_block;
        this.main_memory_size = main_memory_size;

        // No line field for this data structure, as we only have tag and offset
        
        // offset field size is the log(base2) of the size in bytes of a line/block
        this.offset_field_size = Math.log2(num_bytes_per_block);
        // The width of the tag field is the bits in main memory address, minus the Line Width and Offset Width!
        this.tag_width  = Math.log2(main_memory_size) - this.offset_field_size;

        // Again, we track global hit count and miss count
        this.hit_count = 0;
        this.miss_count = 0;
        // I'll also track the amount of items added to the cache, in order to emulate stack behavior for the FIFO replacement policy

        this.cache_count = 0;
        // Unlike the direct map, our fully associative cache has only two fields
        // [ tag ] [ offset ]
        // where block number is simply the tag
        
        this.cache = []
        for (let i = 0; i < this.num_blocks * this.num_sets; i++)
            this.cache.push({
                tag: -1,
                counter: 0,
                set: 0,
            }); 
    // Insert an "empty" object as a placeholder!
    // We will use array.splice to perform most of our operations on the array
    /**
     * Each object will have         
     * Tag: that denotes the tag field of the address
     * Counter: that keeps track of how frequently this element is hit
     * Set: Honestly just decorative, as there is only one set in the fully associative cache
     */
    /**
     * This function performs cache value replacement when necessary, based on the replacement policy outlined during instantiation
     * @param {string} newTag denotes the new tag that will replace some other tag in the cache 
     */
    this.replace = (newTag) => {
        if (replacement_policy === "FIFO") {
            this.cache.splice(0, 1); // Could also use Array.pop()
            this.cache.splice(this.cache.length, 0, {
                tag: newTag,
                counter: this.cache_count,
                set: 0,
            }); // Could've also used Array.push()
            this.cache_count++;
            return;
        }
        else { // If this runs, that means we are using LRU replacement
            let minUse = 200000000;
            let minIndex = -1;
            this.cache.forEach((element, index) => {
                if (element.counter < minUse) {
                    minUse  = element.counter;
                    minIndex = index;
                }
            })
            this.cache.splice(minIndex, 1, {
                tag: newTag,
                counter: this.cache_count,
                set: 0,
            })
            this.cache_count++;
            return;
        }
    }

    this.parseAddress = (address) => {
        let splitAddress = {
            tag: parseInt(address.substring(0, this.tag_width), 2),
            offset: parseInt(address.substring(this.tag_width), 2),
        }
        return splitAddress;
    }
    /**
     * @function load attempts to load the address from the cache, if a miss occurs we load it from main memory into the cache!
     * @param {string} address is a string of the address we are evaluating
     * @returns {bool} true for a hit, false for a miss
     */
    this.load = (address) => {
        // convert the address from hex to binary
        // some function
        // Split the address into tag and offset.
        let {tag, offset} = this.parseAddress(address);
      
        // Since we cant check all cache entries in parallel, we just loop over cache and see if the tag is in there
        let tagFound = false;
        this.cache.forEach((element) => {
            if (element.tag === tag) {
                this.hit_count++; // increment global hit count
                element.counter = this.cache_count; // increment element counter
                this.cache_count++;
                tagFound = true; // store that we had a hit!
            }
        })
        // If we indeed had a hit in this forEach, return 
        if (tagFound)
            return true;
        // If we did not see a hit in forEach, we need to replace our value following our replacement policy!
        // If the amount of items we have added to the cache is greater than or equal to the size of the cache, we have no space, so we must replace
        if (this.cache_count >= this.num_sets * this.num_blocks)
            this.replace(tag);
        else {
            this.cache.splice(this.cache_count, 0, {
                tag: tag,
                counter: this.cache_count,
                set: 0,
            })
            this.cache_count++;
        }
        this.miss_count++;
        // For the purposes of this assignment, we don't really need to care about using offset (as mentioned in the video) but it would be cool to implement it
        // for a sort of visualizer
        
        return false;
    }
    this.getHitRate = () => {
        return this.hit_count/(this.hit_count+ this.miss_count)
    }
    }

}

class NSetCache {
    constructor(num_sets = 1, num_blocks = 8, num_bytes_per_block = 4, main_memory_size = 2^32, replacement_policy = "FIFO") {
        this.num_sets = num_sets;
        this.num_blocks = num_blocks;
        this.num_bytes = num_bytes_per_block;
        this.main_memory_size = main_memory_size;

        // The line field sorta comes back for this cache structure, but instead of blocks mapping to lines, blocks map to sets of lines!
        this.set_field_size = Math.log2(num_sets);
        
        // offset field size is the log(base2) of the size in bytes of a line/block
        this.offset_field_size = Math.log2(num_bytes_per_block);
        // The width of the tag field is the bits in main memory address, minus set and offset field sizes
        this.tag_width  = Math.log2(main_memory_size) - this.offset_field_size - this.set_field_size;

        // Again, we track global hit count and miss count
        this.hit_count = 0;
        this.miss_count = 0;
        // I'll also track the amount of items added to the cache, in order to emulate stack behavior for the FIFO replacement policy
        this.cache_count = 0;
        // Even though we are working with multiple sets, not just 1, our current "cache_count" strategy should still work- our replacement operations however will be localized
        // to whatever set we are performing our operations on

        // Just to emphasize, the address structure for an n-set associative cache is as follows
        // [ Tag ] [ Set ] [ Offset ]


        this.cache = []; // Cache will still be an array

        for (let i = 0; i < this.num_sets; i++) {
            for (let j = 0; j < this.num_blocks; j++) {
                this.cache.push({
                    tag: -1,
                    counter: 0,
                    set: i, // Unlike our previous caches, our set variable actually matters so we increment it accordingly
                });
            }
        }
        

        /**
         * This function performs cache value replacement when necessary, based on the replacement policy outlined during instantiation
         * @param {string} newTag denotes the new tag that will replace some other tag in the cache 
         */
        this.replace = (newTag, setIndex, set) => {
            if (replacement_policy === "FIFO") {
                this.cache.splice(setIndex, 1); // Could also use Array.pop()
                this.cache.splice(setIndex + this.num_blocks - 1, 0, {
                    tag: newTag,
                    counter: this.cache_count,
                    set: set,
                }); // Could've also used Array.push()
                this.cache_count++;
                return;
            }
            else { // If this runs, that means we are using LRU replacement
                let minUse = 200000000000; // some abnormally high number that will always be larger than anything in the counter field
                let minIndex = -1;
                // Loop over the set
                for (let i = setIndex; i < setIndex + this.num_blocks; i++) {
                    if (this.cache[i].counter < minUse) { // small counter suggests the element hasn't been used in a while
                        minUse = this.cache[i].counter;
                        minIndex = i; // in this situation, i denotes the index
                    }
                }
                // Replace the element that has been accessed least recently with the new element!
                this.cache.splice(minIndex, 1, {
                    tag: newTag,
                    counter: this.cache_count,
                    set: set,
                })
                this.cache_count++;
                return;
            }
        }

        this.parseAddress = (address) => {
            let splitAddress = {
                tag: parseInt(address.substring(0, this.tag_width), 2),
                set: parseInt(address.substring(this.tag_width, this.tag_width + this.set_field_size), 2),
                offset: parseInt(address.substring(this.tag_width + this.set_field_size), 2),
            }
            return splitAddress;
        }
        /**
         * @function load attempts to load the address from the cache, if a miss occurs we load it from main memory into the cache!
         * @param {string} address is a string of the address we are evaluating
         * @returns {bool} true for a hit, false for a miss
         */
        this.load = (address) => {
            // We have a tag, an offset, and a set field
            let {tag, set, offset} = this.parseAddress(address);

            // Our set maps to an index, which can be obtained by multiplying set * blocks per set
            let set_index = set*this.num_blocks;

            // Now loop over set and see if tag exists within it;
            for (let i = set_index; i < set_index + this.num_blocks; i++) {
                if (this.cache[i].tag === tag) {
                    this.hit_count++; // increment global hit count
                    this.cache[i].counter = this.cache_count; // increment element counter
                    this.cache_count++; // increment global element counter

                    // Return true if found
                    return true;
                }
            }

            // If we don't find our tag, we need to either add it if there's space or replace an element in the set

            for (let i = set_index; i < set_index + this.num_blocks; i++) {
                // If there's an empty spot, tag should be equal to -1, -> we replace that spot and return false
                if (this.cache[i].tag === -1) {
                    this.cache.splice(i, 1, {
                        tag: tag,
                        set: set,
                        counter: this.cache_count
                    })
                    this.miss_count++;
                    this.cache_count++;

                    // return false to confirm element has been added to cache post-miss
                    return false;
                }
            }

            // If we are here, it means we didn't find our tag, AND there is no space available in our set! What do we do? we replace :)
            this.replace(tag, set_index, set);
            this.miss_count++;
            
            // Return false since this was technically a miss and we had to replace
            return false;
        }
        this.getHitRate = () => {
            return this.hit_count/(this.hit_count+ this.miss_count)
        }
    }

}

module.exports = {NSetCache, Cache, DirectMapCache, FullyAssociativeCache};