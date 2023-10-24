function mockFunction() {
  console.log("Mock function started.");

  setTimeout(function () {
    console.log("Mock function completed.");
  }, 30000); // 30,000 milliseconds = 30 seconds
}

// Call the mock function
mockFunction();
