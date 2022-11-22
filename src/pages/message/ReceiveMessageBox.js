import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { callReceiveMessageListAPI, callRecipientManagementAPI } from "../../api/MessageAPICalls";
import ReceiveMessageBoxCSS from "../message/ReceiveMessageBox.module.css";
import impoicon from "../../img/impoicon.png";
import binicon from "../../img/binicon.png";

function ReceiveMessageBox(){

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [form, setForm] = useState({
        message : {
            messageNo : ''
        },
        receiveMessageCategory : '',
        receiveMessageDelete : ''
    })
    const messages = useSelector(state => state.messageReducer);
    const messageList = messages.data;
    const pageInfo = messages.pageInfo;

    /* 페이징 버튼 */
    const pageNumber = [];
    if(pageInfo) {
        for(let i = pageInfo.startPage; i <= pageInfo.endPage; i++) {
            pageNumber.push(i);
        }
    }

    useEffect(
        () => {
            dispatch(callReceiveMessageListAPI({
                currentPage : currentPage
            }));
        }
        , [currentPage]
    )

    /* 메시지 중요 메시지함으로 이동 */
    const moveToImpoMessageBox = (num) => {
        
        setForm({
            message : {
                messageNo : num
            },
            receiveMessageCategory : 'impoMessageBox',
            receiveMessageDelete : null
        });

    }

    return(
        <>
            <div className={ReceiveMessageBoxCSS.box}>
                <h1>받은 메시지함</h1> 
                <table className={ReceiveMessageBoxCSS.tabel}>
                    <thead>
                    <tr>
                        <td>중요</td>
                        <td>발신자</td>
                        <td>내용</td>
                        <td>받은날짜</td>
                        <td>삭제</td>
                    </tr>
                    </thead>
                    <tbody>
                        {
                            Array.isArray(messageList) && messageList.map(
                                (messages =>
                                    <tr
                                        key={ messages.messageNo }
                                    >
                                        <td><img 
                                                src={ impoicon }
                                                onClick={ () => moveToImpoMessageBox(messages.messageNo) }
                                            /></td>
                                        <td>{messages.sender.employeeName}</td>
                                        <td>{messages.messageContent}</td>
                                        <td>{messages.sendDate}</td>
                                        <td><img src={binicon} alt="bin"/></td>
                                    </tr>
                                )
                            )
                        }
                    </tbody>
                </table>
                <div className={ReceiveMessageBoxCSS.page}> 
                    {
                        Array.isArray(messageList) &&
                        <button
                            onClick={ () => setCurrentPage(currentPage - 1) }
                            disabled={ currentPage === 1 }
                            className={ ReceiveMessageBoxCSS.pagingBtn }
                        >
                            &lt;
                        </button>
                    }  
                    {
                        pageNumber.map((num) => (
                            <li 
                                key={num} onClick={ () => setCurrentPage(num) }
                                className={ ReceiveMessageBoxCSS.pageNum }
                            >
                                <button
                                    style={ currentPage === num ? { backgroundColor : 'orange'} : null }
                                >
                                    {num}
                                </button>
                            </li>
                        ))
                    }
                    {
                        Array.isArray(messageList) &&
                        <button
                            onClick={ () => setCurrentPage(currentPage + 1) }
                            disabled={currentPage === pageInfo.maxPage || pageInfo.endPage === 1}
                            className={ ReceiveMessageBoxCSS.pagingBtn }
                        >
                            &gt;
                        </button>
                    }
                </div>
            </div>
        </>
    );
}

export default ReceiveMessageBox;