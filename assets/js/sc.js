const formBody = (body) => {
  let data = [];
  for (let k in body) {
    data.push(`${encodeURIComponent(k)}=${encodeURIComponent(body[k])}`);
  }
  data = data.join("&");
  return data;
};

const sc = {};

const proxy = "https://cors.bridged.cc/";

sc.detect = (text) => true;

sc.decode = async (text) => {
  let response = await fetch(
    `${proxy}https://nin10news.com/wp-content/themes/twentysixteen/inc/decode.php`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formBody({
        data: text,
      }),
    }
  );
  let body = await response.body;
  let data = await body.getReader().read();
  try {
    return atob(new TextDecoder("utf-8").decode(data.value));
  } catch (e) {
    console.log(`Impossible to decode ${text}`);
  }
};

sc.encode = async (text) => {
  let response = await fetch(
    `${proxy}https://nin10news.com/wp-content/themes/twentysixteen/inc/encode.php`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formBody({
        data: btoa(text),
      }),
    }
  );
  let body = await response.body;
  let data = await body.getReader().read();
  try {
    return new TextDecoder("utf-8").decode(data.value);
  } catch (e) {
    console.log(`Impossible to encode ${text}`);
  }
};

export default sc;
