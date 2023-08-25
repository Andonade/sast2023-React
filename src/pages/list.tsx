import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DELETE_SUCCESS, FAILURE_PREFIX } from "../constants/string";
import { request } from "../utils/network";
import { BoardMetaData } from "../utils/types";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import board from "../redux/board";
import { Button } from "antd";

const ListScreen = () => {
    /**
     * @todo [Step 5] 请在下述一处代码缺失部分填写合适的代码，完成游戏记录列表页面 UI
     * @todo [Step 6] 请在下述一处代码缺失部分填写合适的代码，完成网络请求的管理
     */
    const userName = useSelector((state: RootState) => state.auth.name);

    const [refreshing, setRefreshing] = useState(true);
    const [selectedUserName, setSelectedUserName] = useState<string | undefined>(undefined);
    const [boardList, setBoardList] = useState<BoardMetaData[]>([]);

    const router = useRouter();
    const query = router.query;

    useEffect(() => {
        if (!router.isReady) {
            return;
        }

        const name = router.query.name && decodeURIComponent(router.query.name as string);
        setSelectedUserName(name);
        fetchList(name);
    }, [router, query]);

    const fetchList = (name?: string) => {
        setRefreshing(true);
        request(name ? `/api/user/${name}` : "/api/boards", "GET", false)
            .then((res) => setBoardList(res.boards))
            .catch((err) => alert(FAILURE_PREFIX + err))
            .finally(() => setRefreshing(false));
    };

    const deleteBoard = (id: number) => {
        // Step 6 BEGIN
        setRefreshing(true);
        request(`/api/boards/${id}`, "DELETE", true)
            .catch((err) => alert(FAILURE_PREFIX + err))
            .finally(() => setRefreshing(false));
        // Step 6 END
    };

    const convert2Date = (timeStamp: number) => {
        const date = new Date(timeStamp * 1000);
        return `
            ${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}
        `;
    };

    return refreshing ? (
        <p> Loading... </p>
    ) : (
        <>
            {selectedUserName !== undefined && <h4> Boards of {selectedUserName} </h4>}
            <Button onClick={() => router.push("/")} >
                Go back to free mode
            </Button>
            {selectedUserName !== undefined && (
                <Button onClick={() => router.push("/list")}>
                    Go to full list
                </Button>
            )}
            {boardList.length === 0 ? (
                <p> Empty list. </p>
            ) : (
                <div style={{ display: "flex", flexDirection: "column" }}>{
                    // Step 5 BEGIN
                    boardList.map((board) => (
                        <div>
                            <p>ID: {board.id}</p>
                            <p>Name: {board.boardName}</p>
                            <p>Created by: {board.userName}</p>
                            <p>Created at: {convert2Date(board.createdAt)}</p>
                            <div style={{ display: "flex", flexDirection: "row"}}>
                                <Button onClick={() => router.push(`/?id=${board.id}`)}>
                                    Play it
                                </Button>
                                {board.userName === userName && (
                                    <Button onClick={() => {
                                        deleteBoard(board.id);
                                        alert(DELETE_SUCCESS);
                                        router.push("/list")}}>
                                        Delete it
                                    </Button>
                                )}
                                <Button onClick={() => router.push(`/list?name=${board.userName}`)}>
                                    View this user
                                </Button>
                            </div>
                        </div>
                    ))
                    // Step 5 END
                }</div>
            )}
        </>
    );
};

export default ListScreen;