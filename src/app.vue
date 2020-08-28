<template>
  <div>
    <div class="main ignore mint">
      <div class="title">尺码表</div>
      <table>
        <thead>
          <tr>
            <th>尺码</th>
            <th>胸围</th>
            <th>肩宽</th>
            <th>衣长</th>
            <th>袖长</th>
          </tr>
        </thead>
        <tbody>
            <tr>
            <td>S</td>
            <td>86</td>
            <td>35</td>
            <td>89</td>
            <td>58</td>
          </tr>
          <tr>
            <td>M</td>
            <td>90</td>
            <td>36</td>
            <td>90</td>
            <td>59</td>
          </tr>
          <tr>
            <td>L</td>
            <td>94</td>
            <td>37</td>
            <td>91</td>
            <td>60</td>
          </tr>
          <tr>
            <td>XL</td>
            <td>98</td>
            <td>38</td>
            <td>92</td>
            <td>61</td>
          </tr>
              <tr>
            <td>XXL</td>
            <td>102</td>
            <td>39</td>
            <td>93</td>
            <td>62</td>
          </tr>
        </tbody>
      </table>
      <div>
        <img :src="im" alt="" />
      </div>
    </div>
  </div>
</template>
<script>
import im from "./im.png";
export default {
  data() {
    return {
      im,
      visible: false
    };
  },
  methods: {
    c() {
      this.visible = !this.visible;
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  width: 750px;
}
.title {
  font-size: 24px;
  text-align: center;
  color: #333;
}
table {
  width: 100%;
  margin-top: 10px;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th {
  background: #999;
  color: #fff;
  height: 30px;
}
tr,
th,
td {
  text-align: center;
  height: 30px;
}

img {
  max-width: 100%;
}
</style>
