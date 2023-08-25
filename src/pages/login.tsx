import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX, LOGIN_FAILED, LOGIN_SUCCESS_PREFIX } from "../constants/string";
import { useRouter } from "next/router";
import { setName, setToken } from "../redux/auth";
import { useDispatch } from "react-redux";
import { Button, Input, Space} from "antd";
import { SP } from "next/dist/shared/lib/utils";

const LoginScreen = () => {
    /**
     * @todo [Step 4] 请在下述一处代码缺失部分以在登陆/注册成功时正确设定 redux 中保存的 JWT 信息
     */
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();
    const dispatch = useDispatch();

    const login = () => {
        fetch(`${BACKEND_URL}/api/login`, {
            method: "POST",
            body: JSON.stringify({
                userName,
                password,
            }),
        })
            .then((res) => res.json())
            .then((res) => {
                if (Number(res.code) === 0) {
                    // Step 4 BEGIN
                    dispatch(setToken(res.token));
                    // Step 4 END

                    dispatch(setName(userName));
                    alert(LOGIN_SUCCESS_PREFIX + userName);

                    /**
                     * @note 这里假定 login 页面不是首页面，大作业中这样写的话需要作分支判断
                     */
                    router.back();
                }
                else {
                    alert(LOGIN_FAILED);
                }
            })
            .catch((err) => alert(FAILURE_PREFIX + err));
    };

    return (
        <Space direction="vertical">
            <Input
            style={{width: "100%"}}
            placeholder="User name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            />
            <Input.Password
                style={{width: "100%"}}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={login} disabled={userName === "" || password === ""}>
                Register/Login
            </Button>
        </Space>
    );
};

export default LoginScreen;
