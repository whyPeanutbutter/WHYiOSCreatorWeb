<template>
      <!--导航-->
  <div>
    <div class="animate__animated animate__fadeIn title"  :style="{'background-image': bgUrl}"></div>
    <el-header  class="animate__animated animate__fadeIn">
      <h2 class="animate__animated animate__swing logo" >haihai</h2>
      <div class="menu-expend">
        <i class="el-icon-menu"></i>
      </div>
      <div class="search_input">
        <el-input

                class="search"
                placeholder="请输入内容"
                prefix-icon="el-icon-search">
        </el-input>
      </div>
    </el-header>
  </div>
</template>

<script>
export default {
  data () {
    return {
      bgUrl:'url(http://img.haihaina.cn/Shinichi6.jpeg)'
    }
  }
}
</script>

<style>

  .search input.el-input__inner {
    background-color: rgba(0, 0, 0, 0.1);
    /*border-radius: 20px;*/
    color: #cccccc;
  }
</style>

<style scoped lang="less">

  .title {
    position: fixed;
    top: 0;
    width: 100%;
    height: 120vh;
    background-repeat: no-repeat;
    background-size: cover;
    border-bottom: 3px solid #fff;
  }

  .el-header {
    transition: .2s;
  }

  .el-header:hover {
    opacity: 1 !important;
  }

  .el-menu {
    background-color: rgba(0, 0, 0, 0) !important;
  }

  .el-menu /deep/ .el-menu-item{
    background-color: rgba(0, 0, 0, 0) !important;
  }


  .el-menu /deep/ .el-menu-item i {
    color: rgba(255, 255, 255);
  }

  .el-menu /deep/ .el-menu-item:hover i {
    color: white;
  }

  .el-menu /deep/ .el-menu-item:hover {
    background-color: rgba(0, 0, 0, 0.5) !important;
  }

  .search_input {
    position: relative;
    box-sizing: border-box;
  }


  .search_input ul {
    position: absolute;
    top: 30px;
    width: 100%;
    border: 1px solid #e5e9ef;
    margin-top: 1px;
    background: #fff;
    z-index: 10000;
    border-radius: 2px;
    box-shadow: 0 2px 4px rgba(58, 118, 142, 0.16);
    padding: 10px 0;
    font-size: 14px;
    box-sizing: border-box;
  }

  .search_input ul li {
    padding: 0 16px;
    height: 32px;
    line-height: 32px;
    cursor: pointer;
    word-wrap: break-word;
    word-break: break-all;
    display: block;
    color: #222;
    position: relative;
    /*transition: .2 ease;*/
  }

  .search_input ul li:hover {
    background-color: #e8f3ff;
  }


  .search-blog {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    padding-left: 20px;
    padding-right: 20px;
  }

  .el-header {
    width: 100%;
    position: sticky;
    top: 0;
    z-index: 9999;
    background-color: rgba(0, 0, 0, 0.2);
    color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;

    > div {
      display: flex;
      align-items: center;
    }

    img {
      height: 40px;
    }

    span {
      margin-left: 15px;
    }

    button {
      opacity: 0.8;
    }

    .el-menu {
      flex-shrink: 0;
    }

    .logo {
      color: #ffd04b;
    }

    .logo:hover {
      cursor: pointer;
    }

  }

  .loginInfo {
    flex-shrink: 0;
    /*background-color: #545c64;*/
    color: white;
    height: 60px;
    border: none;
    width: 160px;
    position: relative;

    .el-avatar {
      width: 36px;
      height: 36px;
      margin: 0 auto;
      z-index: 200;
    }

    .user-option {
      position: absolute;
      top: 60px;
      width: 150px;
      left: 50%;
      transform: translate(-50%, 0);
      font-size: 14px;
      text-align: center;
      line-height: 30px;
      background-color: #fff;
      visibility: hidden;
      opacity: 0;
      color: #333;
      box-shadow: 0 2px 6px 0 rgb(0 0 0 / 10%);
      border: 1px solid #eee;
      border-radius: 5px;
    }

    .logout {
      margin: 10px auto;
      padding: 0;
      width: 100%;
    }

    .logout:hover {
      background-color: #eee;
    }
  }

  .loginInfo:hover {
    cursor: pointer;

    .el-avatar {
      transform: translate(0, 50%) scale(1.5);
      transition: .3s;
    }

    .user-option {
      visibility: visible;
      opacity: 1;
      transition: opacity .4s;
    }
  }

  .zZindex {
    margin-top: 300px;
    padding-top: 100px;
  }

  .menu-expend {
    display: none !important;
  }

  .el-menu-hidden {
    /*display: none;*/
    position: absolute;
    top: 60px;
    left: 0;
    border-top: 1px solid #ccc;
    border-right: none;
    width: 100%;

    .el-menu-item {
      border-bottom: 1px solid #ccc;
    }
  }

  @media screen and (max-width: 1000px) {
    .search_input {
      visibility: hidden;
    }
  }

  @media screen and (max-width: 768px) {
    .el-menu /deep/ .el-menu-item{
      background-color: rgba(0, 0, 0, 0.3) !important;
    }

    .el-menu-demo {
      display: none;
    }

    .title {
      width: 100%;
      background-position-x: center;
    }

    .menu-expend {
      display: block !important;
      position: fixed;
      top: 18px;
      left: 150px;
    }

    .menu-expend:hover {
      color: #ffd04b;
      cursor: pointer;
    }

    .title {
      background-position-y: 0;
    }
  }

</style>
