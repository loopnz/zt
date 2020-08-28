async function wait() {
  let res;
  try {
    res = await new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error("接口错误"));
      }, 1000);
    });
  } catch (error) {
    console.log(error);
  }

  console.log(res);
}




export { wait };
