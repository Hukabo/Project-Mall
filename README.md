# 🛒 Mall Project

온라인 의류 쇼핑몰 서비스를 구현한 **풀스택 웹 애플리케이션**입니다.

---

## 🔗 배포 링크

- **[https://mall.auction](https://mall.auction)**
+ 게스트 ID 및 Password
  ```
    admin@admin.com
    123123123a!
  ```
---

## 📌 프로젝트 개요

- **프로젝트명**: Mall
- **개발 기간**: 2026.01 ~ (진행 중)
- **개발 인원**: 개인
- **목적**
  - 실제 서비스에 가까운 쇼핑몰 도메인 경험
  - 기획부터 배포 및 유지보수까지 풀스택 개발자로서의 역량 향상
  - 개발 과정속에서의 트러블 슈팅으로 인한 문제 해결 능력 향상

---

## 🛠️ 사용 기술 스택

### Frontend
- React
- Next.js
- TypeScript
- Tailwind CSS

### Backend
- Nest.js
- TypeORM
- PostgreSQL
- JWT Authentication(Cookie 인증 방식)

### Devops & Tools
- Vercel
- AWS EC2 / RDS
- Git & GitHub
- Postman

---
## ERD
<img width="1022" height="605" alt="ERD" src="https://github.com/user-attachments/assets/3999d9f5-70e6-4f36-ae39-ecebf40670ad" />

---

## 주요 기능

### 회원
- JWT 로그인
- 401에러 발생시 Refresh Token 재발급 시도후 재요청
- Cookie 기반 인증
- 사용자 권한 분리(USER / ADMIN)
- Daum 우편번호 서비스 api 연동

### 상품
- 이미지 파일 업로드(cloud)
- 상품 조회(무한 스크롤)
- 카테고리 or 상품 이름 검색 기능
- 계층형 카테고리(부모 카테고리 -> 자식 카테고리)
- OpenAI를 활용한 상품 생성(이미지 및 JSON)

### 장바구니
- 동일 상품 수량 병합
- 재고 보다 많은 수량 담기 제한
- 수량 변경 즉시 DB 업데이트

### 주문
- 토스페이먼츠 결제 연동(테스트 환경)
- 주문 성공, 실패 케이스 처리
- 주문 생성 및 상태 관리
- 주문 내역 조회

## 트러블 슈팅

### 1. 초기 단일 카테고리 구조 문제
**문제**

> 다양한 의류 카테고리가 필요한 쇼핑몰 프로젝트에서 초기의 단일 카테고리 구조(상의, 하의, 신발 등)는 적합하지 않음

**했던 시도들**

> 카테고리를 부모 카테고리와 자식 카테고리로 나눔 (예 부모: 상의, 자식: 셔츠)\
> 하지만 추후 카테고리를 새롭게 추가할 때마다 매번 새롭게 생성 해야하는 문제 발생

**해결**
```typescript
@Entity('category')
export class Category {
  .
  .
  .
  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  parent!: Category | null;

  @OneToMany(() => Category, (category) => category.parent)
  children!: Category[];
}
```
자기참조 관계로 만들어서 새롭게 카테고리가 추가 되더라도 구조를 유지

### 2. EC2 서버 다운 문제
**문제**

> SSH프로토콜을 통해 연결된 EC2 파이프가 끊길 시,</br> 포그라운드로 실행되던 프로세스가 종료되는 문제
> 때문에 EC2에서 실행중이던 Nest.js 서버가 같이 종료되는 문제 발생


**원인**

> SSH 접속을 끊으면, 그 세션에서 실행중이던 프로세스에 SIGHUP(Hang Up)이 전달됨\
> 리눅스 운영체제를 이용하였는데 리눅스 프로세스는 이 시그널을 받으면 종료하게 되어있음

**해결**

> EC2에 pm2 패키지를 설치하여 해결\
> pm2는 프로세스를 데몬 형태로 벡그라운드에서 실행하고 SSH세션과 분리하여 SSH연결이 끊기더라도\
> 서버가 계속 실행되도록 하였음

### 3. 중복되는 유저 조회 요청 문제

**문제**

> 회원 정보가 필요한 페이지 마다 useEffect로 중복되는 네트워크 요청하는 문제

**원인**

> 유저 정보를 전역으로 공유할 방법이 없었기 때문에, 각각의 컴포넌트에서 fetch를 수행함

**해결**

```typescript
export const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  refetchUser: async () => {},
  logout: async () => {},
});

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function refetchUser() {
    try {
      const user = await api.get<User>("users/profile");

      setUser(user);
    } catch (error) {
      console.error(error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await api.patch("auth/logout");
    setUser(null);
  }

  useEffect(() => {
    refetchUser();
  }, []);

  if (loading) return <Loading />;

  return (
    <UserContext value={{ user, loading, refetchUser, logout }}>
      {children}
    </UserContext>
  );
}

```
UserContext를 만들어 앱 최상단에서 유저 정보를 한 번만 조회해 전역 상태로 관리하도록 변경

### 4. Toss Payments 위젯 중복 초기화

**문제**

> 결제 요청 시 "이미 처리중인 요청입니다." 에러 발생

**원인**

> 개발모드에서 리액트 StrictMode가 의도적으로 'useEffect'를 두번 실행함.\
> cleanup로직이 없는 상태에서 주문 요청이 연달아 두 번 발생 했던 것이 원인이었음.

**해결**

```typescript
const initialRef = useRef(false);

  useEffect(() => {
    if (initialRef.current) {
      return;
    } else {
      initialRef.current = true;
    }

    async function processPayment() {
  .
  .
  .
  }
}
```

'useRef'로 초기화 여부를 추적하여 두 번째 요청은 무시하도록 가드 설정함. 
