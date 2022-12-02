import Footer from '@/components/Footer';
import {login, register} from '@/services/ant-design-pro/api';
import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { Alert, message, Tabs } from 'antd';
import React, { useState } from 'react';
import { FormattedMessage, history, SelectLang, useIntl, useModel } from 'umi';
import styles from './index.less';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const LoginRegister: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('account');
  const [buttonText, setButtonText] = useState<string>('登陆')
  const { initialState, setInitialState } = useModel('@@initialState');

  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };
  //发送登陆请求
  const handleLoginSubmit = async (values: API.LoginParams) => {
    try {
      // 登录
      const result = await login({ ...values, type });
      if (result.code === 0) {
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！',
        });
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const { query } = history.location;
        const { redirect } = query as { redirect: string };
        console.log(redirect);
        history.push(redirect || '/');
        return;
      } else {
        // 如果失败去设置用户错误信息
        setUserLoginState(result.data);
        throw new Error(result.description);
      }
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败，请重试！',
      });
      message.error(defaultLoginFailureMessage);
    }
  };
  //发送注册请求
  const handleRegisterSubmit = async (values: API.RegisterParams) => {
    const {userPasswordRegister, checkPasswordRegister} = values;
    if (userPasswordRegister !== checkPasswordRegister) {
      message.error("密码不一致，请重新输入");
      return;
    }
    try {
      // 注册
      const result = await register({ ...values });
      if (result.code === 0) {
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.register.success',
          defaultMessage: '注册成功！请登录',
        });
        message.success(defaultLoginSuccessMessage);
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const { query } = history.location;
        const { redirect } = query as { redirect: string };
        history.push(redirect || '/');

        //切换到登陆表单
        setType('account');
        return;
      } else {
        throw new Error(result.description);
      }
    } catch (error: any) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.register.failure',
        defaultMessage: '注册失败，请重试!',
      });
      message.error(error.message || defaultLoginFailureMessage);
    }
  }
  const { status, type: loginType } = userLoginState;
  // 切换登陆和注册，并修改对应的按钮文本
  const changeText = (formType: string) => {
    setType(formType);
    setButtonText(formType === 'account' ? '登陆': '注册')
  }
  return (
    <div className={styles.container}>
      <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div>
      <div className={styles.content}>
        <LoginForm
          submitter={{
            searchConfig: {
              submitText: buttonText
            }
          }}
          logo={<img alt="logo" src="/logo.svg" />}
          title="用户中心"
          subTitle={"我的愿望是世界和平"}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            if (type === 'account') {
              await handleLoginSubmit(values as API.LoginParams);
              return;
            }
            if (type === 'register') {
              await handleRegisterSubmit(values as API.RegisterParams)
            }
          }}
        >
          <Tabs activeKey={type} onChange={(formType: string) => changeText(formType)}>
            <Tabs.TabPane
              key="account"
              tab={intl.formatMessage({
                id: 'pages.login.accountLogin.tab',
                defaultMessage: '账号密码登录',
              })}
            />
            <Tabs.TabPane
              key="register"
              tab={'注册用户'}
            />
          </Tabs>

          {status === 'error' && loginType === 'account' && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.login.accountLogin.errorMessage',
                defaultMessage: '账户或密码错误(cuiwu/123456789)',
              })}
            />
          )}
          {type === 'account' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'请输入账号'}
                rules={[
                  {
                    required: true,
                    message: '账号是必填项',
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'请输入密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项',
                  },
                  {
                    min: 8,
                    message: '密码长度不能小于8'
                  }
                ]}
              />
            </>
          )}
          {type === 'register' && (
            <>
              <ProFormText
                name="userAccountRegister"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'请输入账号'}
                rules={[
                  {
                    required: true,
                    message: '账号是必填项',
                  },
                ]}
              />
              <ProFormText
                name="planetCodeRegister"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'请输入星球编号'}
                rules={[
                  {
                    required: true,
                    message: '星球编号是必填项',
                  },
                ]}
              />
              <ProFormText.Password
                name="userPasswordRegister"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'请设置密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项',
                  },
                  {
                    min: 8,
                    message: '密码长度不能小于8'
                  }
                ]}
              />
              <ProFormText.Password
                name="checkPasswordRegister"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'请确认密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项',
                  },
                  {
                    min: 8,
                    message: '密码长度不能小于8'
                  }
                ]}
              />
            </>
          )}
          {/*{status === 'error' && loginType === 'mobile' && <LoginMessage content="验证码错误" />}*/}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
            >
              <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />
            </a>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default LoginRegister;
