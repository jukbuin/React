import './App.css';
import {useState} from 'react';

function Header(props) {
    return <header>
        <h1><a href="/" onClick={(event) => {
            event.preventDefault();
            props.onChangeMode();
        }}>{props.title}</a></h1>
    </header>
}

function Nav(props) {
    const lis = []
    for (let i = 0; i < props.topics.length; i++) {
        let t = props.topics[i];
        lis.push(<li key={t.id}>
            <a id={t.id} href={'/read/' + t.id} onClick={event => {
                event.preventDefault();
                props.onChangeMode(Number(event.target.id));
            }}>{t.title}</a>
        </li>)
    }
    return <nav>
        {lis}
    </nav>
}

function Article(props) {
    return <article>
        <h2>{props.title}</h2>
        {props.body}
    </article>
}

function Create(props) {
    return <article>
        <h2>새로 만들기</h2>
        <form onSubmit={event => {
            event.preventDefault();
            const title = event.target.title.value;
            const body = event.target.body.value;
            props.onCreate(title, body);
        }}>
            <p><input type="text" name="title" placeholder="제목"/></p>
            <p><textarea name="body" placeholder="내용"></textarea></p>
            <p><input type="submit" value="Create"/></p>
        </form>

    </article>
}

function Update(props){
    const [title, setTitle] = useState(props.title);
    const [body, setBody] = useState(props.body);
    return <article>
        <h2>수정하기</h2>
        <form onSubmit={event => {
            event.preventDefault();
            const title = event.target.title.value;
            const body = event.target.body.value;
            props.onUpdate(title, body);
        }}>
            <p><input type="text" name="title" placeholder="title" value={title} onChange={(event=>{
                setTitle(event.target.value);
            })}/></p>
            <p><textarea name="body" placeholder="body" value={body} onChange={(event=>{
                setBody(event.target.value);
            })}></textarea></p>
            <p><input type="submit" value="Update"/></p>
        </form>

    </article>
}
function App() {
    const [mode, setMode] = useState('WELCOME');
    const [id, setId] = useState(null);
    const [nextId, setNextId] = useState(4);
    const [topics, setTopics] = useState([
        {id: 1, title: '장보기 목록', body: '당근, 과자, 아이스크림'},
        {id: 2, title: '화장품 목록', body: '아이크림, 토너, 선크림'},
        {id: 3, title: '미강이 만나기', body: '2시 홈플러스'}
    ]);
    let content = null;
    let contextControl = null;
    if (mode === 'WELCOME') {
        content = <Article title="상세보기" body="목록을 클릭하세요."></Article>
    } else if (mode === 'READ') {
        let title, body = null;
        for (let i = 0; i < topics.length; i++) {
            if (topics[i].id === id) {
                title = topics[i].title;
                body = topics[i].body;
            }
        }
        content = <Article title={title} body={body}></Article>
        contextControl = <>
            <li><a href={'/update'+id} onClick={event => {
            event.preventDefault();
            setMode('UPDATE');
            }}>수정하기</a></li>
            <li><input type="button" value="Delete" onClick={()=>{
                const newTopics = []
                for(let i=0; i<topics.length; i++){
                    if(topics[i].id !== id){
                        newTopics.push(topics[i]);
                    }
                }
                setTopics(newTopics);
                setMode('WELCOME');
            }}/></li>
        </>
    } else if (mode === 'Create') {
        content = <Create onCreate={(_title, _body) => {
            const newTopic = {id: nextId, title: _title, body: _body}
            const newTopics = [...topics]
            newTopics.push(newTopic);
            setTopics(newTopics);
            setMode('READ');
            setId(nextId);
            setNextId(nextId + 1);
        }}></Create>
    } else if(mode === 'UPDATE'){
        let title, body = null;
        for (let i = 0; i < topics.length; i++) {
            if (topics[i].id === id) {
                title = topics[i].title;
                body = topics[i].body;
            }
        }
        content = <Update title={title} body={body} onUpdate={(title, body)=>{
            console.log(title, body);
            const newTopics = [...topics]
            const updatedTopic = {id:id, title:title, body:body}
            for(let i=0; i<newTopics.length; i++){
                if(newTopics[i].id === id){
                    newTopics[i] = updatedTopic;
                    break;
                }
            }
            setTopics(newTopics);
            setMode('READ');
        }}></Update>
    }

    return (
        <div>
            <Header title="나의 메모장" onChangeMode={() => {
                setMode('WELCOME');
            }}></Header>
            <Nav topics={topics} onChangeMode={(_id) => {
                setMode('READ');
                setId(_id);
            }}></Nav>
            {content}
            <ul>
                <li><a href="/create" onClick={event => {
                    event.preventDefault();
                    setMode('Create');
                }}>새로 만들기</a></li>
                {contextControl}
            </ul>
        </div>
    );
}

export default App;
