const stdin = process.openStdin();

stdin.addListener('data', function (data) {
  console.log(data.reverse().toString());
});
