import React, { useState } from "react";
import { Form, Button, message, Input, Space } from "antd";
import { request } from "../../util/helper";
import { setAcccessToken, setPermission, setProfile } from "../../store/profile.store";
import { useNavigate } from "react-router-dom";
import login_p1 from "../../assets/login.png";
function LoginPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();
  const onLogin = async (item) => {
    setLoading(true);
    const param = {
      username: item.username,
      password: item.password,
    };
    try {
      const res = await request("auth/login", "post", param);
      if (res && !res.error) {
        setAcccessToken(res.access_token);
        setProfile(JSON.stringify(res.profile));
        setPermission(JSON.stringify(res.permission));
        if (res.profile?.user_id) {
          localStorage.setItem("user_id", res.profile.user_id);
        }
        navigate("/");
        message.success("Login successful!");
      } else {
        message.error("Login failed! Please check your username and password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  const onRegister = async (item) => {
    setLoading(true);
    const param = {
      username: item.username,
      password: item.password,
      email: item.email,
    };
    try {
      const res = await request("auth/register", "post", param);
      if (res && !res.error) {
        message.success("Registration successful! You can now log in.");
        setIsRegistering(false);
      } else {
        message.error("Registration failed! Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      message.error("An error occurred during registration. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const abouthere =()=>{
    navigate("/about")
  }
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundImage: `url(${login_p1})`,
        backgroundSize: "cover",
        backgroundPosition: "center", 
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        style={{
          maxWidth: 400,
          margin: "0 auto",
          padding: 20,
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          borderRadius: "8px",
        }}
      >
        <h1 style={{ textAlign: "center", color: "#333" }}>
          {isRegistering ? "Register" : "Login"}
        </h1>
        <Form layout="vertical" form={form} onFinish={isRegistering ? onRegister : onLogin}>
          {isRegistering && (
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
          )}
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please enter your username!" }]}
          >
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Space style={{ width: "100%" }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
              >
                {isRegistering ? "Register" : "Login"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
        <div style={{ textAlign: "center" }}>
          {isRegistering ? (
            <span>
              Already have an account?{" "}
              <a
                onClick={() => setIsRegistering(false)}
                style={{ color: "#1890ff", cursor: "pointer" }}
              >
                Login here
              </a>
            </span>
          ) : (
            <span>
          
              <a
                onClick={() => abouthere(true)}
                style={{ color: "#1890ff", cursor: "pointer" ,textAlign:"right" }}
              >
               About here 
              </a>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
export default LoginPage;