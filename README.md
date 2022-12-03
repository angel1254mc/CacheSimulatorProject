
# Multi Architecture Cache Simulator!
A cache simulator built in JavaScript for CDA3101

### How to run
In order to run this project you must have the NodeJS Runtime installed

First, clone the repository using the git CLI, or download as a ZIP File and extract to a folder

*cd* into the directory from the commandline, and run *npm install* to download all project dependencies
```bash
    cd my-project
    npm install
```

Once all dependencies are installed you can run the main file using the following commandline
```bash
    node start.js
```

You will be prompted to input the amount of bytes per block for the cache, input a number greater than or equal to 4

Finally the command line will print out when it has finalized the simulation over all cache architectures for all 6 of the predetermine cache sizes
The hitrates for each of these cache architectures will be organized in JSON format, outputted in the 'hit-rate-data.JSON' file.

**Finally, you can take the data and plot it using your language of choice.** I utilized MATLAB, and the code used to generate my plots can be found in **plot_data.m**
