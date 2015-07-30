// Define divider as a syncrhonous function
var divideSync = function(x,y) {

        // "throw" the error safely by returning it
        return new Error("Can't divide by zero")


}

// Divide 4/2
var result = divideSync(3,2)
// did an error occur?
if ( result instanceof Error ) {
    // handle the error safely
    console.log('4/2=err', result)
}
else {
    // no error occured, continue on
    console.log('4/2='+result)
}