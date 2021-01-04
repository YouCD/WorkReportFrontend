<template>
  <div class="form-con">
    <div style="padding-bottom: 50px">
      <h1><center>WorkLog System</center> </h1>
    </div>
  <a-form
    id="components-form-demo-normal-login"
    :form="form"
    class="login-form"
    @submit="handleSubmit"
  >
    <a-form-item>
      <a-input
        v-decorator="[
          'username',
          { rules: [{ required: true, message: '请输入用户名' }] },
        ]"
        placeholder="用户名：邮箱前缀"
      >
        <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-input-password
        v-decorator="[
          'password',
          { rules: [{ required: true, message: '请输入密码' }] },
        ]"
        type="password"
        placeholder="请输入密码"
      >

        <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
      </a-input-password>
    </a-form-item>
    <a-form-item>
<!--        <a-checkbox-->
<!--          v-decorator="[-->
<!--          'remember',-->
<!--          {-->
<!--            valuePropName: 'checked',-->
<!--            initialValue: true,-->
<!--          },-->
<!--        ]"-->
<!--        >-->
<!--          记住我-->
<!--        </a-checkbox>-->
<!--        <a class="login-form-changpwd" href="http://cucurbitcable.dlab.cn/#/updatepassword">-->
<!--          修改密码-->
<!--        </a>-->
<!--        <a class="login-form-forgot" href="http://cucurbitcable.dlab.cn/#/updatepassword" >忘记密码</a>-->

      <a-button type="primary" @click="handleSubmit" html-type="submit" class="login-form-button">
        Go
      </a-button>
    </a-form-item>
  </a-form>
  </div>
</template>

<script>
import {Login} from '../api/user'

  export default {
    beforeCreate() {
      localStorage.clear()
      this.form = this.$form.createForm(this, { name: 'normal_login' });
    },
    methods: {
      handleSubmit(e) {
        e.preventDefault();
        this.form.validateFields((err, values) => {
          if (!err) {
            Login(values).then(res => {
              if (res.data.flag) {
                this.$message.success(res.data.msg);
                localStorage.setItem('jwt', res.data.data.token);
                localStorage.setItem('uid', res.data.data.uid);
                //获取回跳的redirect地址
                const redirect = this.$route.query.redirect;
                if (redirect) {
                  //如果redirect存在说明当前用户是进入某页面后未登陆自动跳转到登陆页面来的，所以登陆完成后得再次回跳到该地址
                  this.$router.push(redirect)
                } else {
                  //否则跳转到默认的页面，首页或者其他页面
                  this.$router.push('/')
                }
                // this.$router.go(-1);
                // location.reload();
              }else if (!res.data.flag){
                this.$message.success(res.data.msg);
              }

            });
          }
        });
      },

    },
  };
</script>
<style scoped>
  .form-con{
    width: 20%;
    margin:0 auto;
    padding-top:10%;
  }
  #components-form-demo-normal-login .login-form-changpwd {
    float: left;
    /*position: absolute;*/
    right: 50%;
  }
  #components-form-demo-normal-login .login-form-forgot {
    float: right;
  }
  #components-form-demo-normal-login .login-form-button {
    width: 100%;
  }
</style>
