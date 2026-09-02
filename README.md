# 🛒 Mall Project

온라인 의류 쇼핑몰 서비스를 구현한 **풀스택 웹 애플리케이션**입니다.

---

## 📖 목차
- [배포 링크](#-배포-링크)
- [기술 스택](#️-사용-기술-스택)
- [ERD](#erd)
- [주요 기능](#주요-기능)
- [트러블슈팅](#트러블-슈팅)

---

## 🔗 배포 링크

- **[https://mall.auction](https://mall.auction)**
+ 게스트 ID 및 Password
  ```
    guest@guest.com
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

## 시스템 아키텍처
<img width="1240" height="509" alt="시스템 아키텍처" src="https://github.com/user-attachments/assets/c9272618-46bc-420c-860e-729c7426b28c" />


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

## 주요 기능 실사용 이미지

### 회원가입 기능
<img width="800" height="500" alt="회원가입" src="https://github.com/user-attachments/assets/c139c7cc-d596-4485-80a6-dad7cfb05006" />

### 상품 검색 기능
<img width="800" height="500" alt="상품 검색" src="https://github.com/user-attachments/assets/105114b0-b316-4c75-a4f5-cb16fe21c078" />

### 상품 상세 페이지
<img width="800" height="500" alt="상품 상세" src="https://github.com/user-attachments/assets/031cd2f6-9ac4-49c1-9ead-0645383e07de" />

### 장바구니 기능
<img width="800" height="500" alt="장바구니 기능" src="https://github.com/user-attachments/assets/178fe538-a61f-48fe-af01-3f22eb9237b3" />

### 결제 및 주문 기능
<img width="800" height="500" alt="결제 기능" src="https://github.com/user-attachments/assets/e0c97042-73e5-4896-8f86-5f6c62bc40d8" />

<img width="800" height="500" alt="주문 기능" src="https://github.com/user-attachments/assets/cadeb00e-38e3-49ff-8056-c64b0be97956" />

----

## 🛠️ 테스트 목록

### 1. 동시성 테스트
- 대상: 상품 재고량
- 목적: 동일 상품에 대한 동시 결제 요청 시 재고와 주문에 대한 정합성 보장
- 테스트 툴: k6
#### Lock 적용 전
| 항목 |  |  |  |
|:---:|:---:|:---:|:---:|
| 동시 요청 | 10 | 50 | 100 |
| 초기 재고 | 5  | 10 | 20 |
| 성공 주문 | 10 | 18 | 29 |
| 재고 초과 판매 | 5 | 8 | 9 |
| 최종 재고 | -5 | -8 | -9 |
| p50 |134.71ms|149.65ms|266.7ms|
| p90 |136.47ms|236.22ms|289.35ms|
| p95 |136.64ms|236.9ms|343.46ms|

#### Lock 적용 후(비관적 락)
| 항목 |  |  |  |
|:---:|:---:|:---:|:---:|
| 동시 요청 | 10 | 50 | 100 |
| 초기 재고 | 5  | 10 | 20 |
| 성공 주문 | 5 | 10 | 20 |
| 재고 초과 판매 | 0 | 0 | 0 |
| 최종 재고 | 0 | 0 | 0 |
| p50 |543.38ms|1.07s|2.17s|
| p90 |548.86ms|1.08s|2.2s|
| p95 |549.13ms|1.08s|2.21s|

#### DB 레벨 처리 (Atomic Query)
| 항목 |  |  |  |
|:---:|:---:|:---:|:---:|
| 동시 요청 | 10 | 50 | 100 |
| 초기 재고 | 5  | 10 | 20 |
| 성공 주문 | 10 | 10 | 20 |
| 재고 초과 판매 | 0 | 0 | 0 |
| 최종 재고 | 0 | 0 | 0 |
| p50 |52.37ms|48.86ms|48.37ms|
| p90 |53.53ms|62.41ms|103.51ms|
| p95 |53.65ms|63.75ms|111.25ms|

#### 분석

- **Lock 미적용**: 락(Lock) 미적용 시 요청이 동시에 몰릴 경우 응답은 비교적 빨랐으나 **경쟁 상태(Race Condition)가 발생하여 데이터 정합성이 보장되지 않았습니다.**
- **Lock 적용**: 데이터를 읽는 순간 Lock을 걸어 다른 트랙젝션이 접근하지 못하게하여 **데이터의 일관성은 유지 할 수 있었으나** 락을 획득한 트랜젝션이 끝날 때까지 다른 트랜젝션들이 대기해야 하기 때문에 **성능저하 및 대기시간이 증가**하였습니다.
- **DB 레벨 처리**: 데이터를 바로 DB 레벨에서 조건부로 처리하기 때문에 **네트워크 부하 및 Round trip이 감소하여 성능은 향상**되었으나 부하가 높아질 경우 **확장성 문제 및 이력 추적이 어렵다는 문제**가 있었습니다.

**결론**: 처음에는 **pessimistic_wrtie로 상품을 조회하는 부분만 atomic query로 변경**하려 하였으나 주문된 상품의 재고 부족 발생 시 해당 상품의 정보(식별번호, 재고량, 주문 수량 등)를 추적하기 어렵다는 문제와 추후 상품 정보와 관련된 비지니스 로직(전용 쿠폰, 구매 수량 제한 등)이 추가 될 경우 재고량 감소를 DB 레벨에서만 다루기에는 문제가 생기기 때문에, 다소 성능이 감소 하더라도 **pessimistic_wrtie로 상품을 조회 하되 아래 기존 코드를 개선**하여 네트워크 왕복(round trip)을 최소한으로 하여 채택하였습니다.

**개선 전**

```typescript
      // 상품에 lock을 걸어 병렬적으로 조회
      // ! 상품 수 만큼 네트워크 왕복 문제 및 데드락 문제 발생 !
      const lockedSpecs = await Promise.all(
        order.orderItems.map(async (item) => {
          const spec = await manager.findOne(ProductSpec, {
            where: {
              id: item.productSpec.id,
            },
            lock: {
              mode: 'pessimistic_write',
            },
          });

          if (!spec) {
            throw new NotFoundException(
              '주문 생성 중 일부 상품 조회에 실패하였습니다.',
            );
          }

          return { spec, quantity: item.quantity };
        }),
      );

      // 재고 감소
      for (const { spec, quantity } of lockedSpecs) {
        if (spec.stock < quantity) {
          throw new ConflictException(`주문 상품 재고량이 부족합니다. sku: ${spec.sku}, 재고량: ${spec.stock}, 주문량: ${quantity}`);
        }

        await manager.decrement(
          ProductSpec,
          { id: spec.id },
          'stock',
          quantity,
        );
      }
```

**개선 후**

```typescript
      // 상품 id를 순차적으로 나열하여 조회하여 데드락 발생x
      const specIds = order.orderItems
        .map((item) => item.productSpec.id)
        .sort((a, b) => a - b);

      // IN으로 한 번에 조회하여 round trip 최소화
      const specs = await manager
        .getRepository(ProductSpec)
        .createQueryBuilder('spec')
        .setLock('pessimistic_write')
        .where('spec.id IN (:...specIds)', { specIds })
        .orderBy('spec.id', 'ASC')
        .getMany();

      const specAndQty = order.orderItems.map((item) => {
        const spec = specs.find((s) => s.id === item.productSpec.id);

        if (!spec)
          throw new NotFoundException(
            '주문 생성 중 일부 상품 조회에 실패하였습니다.',
          );

        return { spec, quantity: item.quantity };
      });

      // 재고 감소
      for (const { spec, quantity } of specAndQty) {
        if (spec.stock < quantity) {
          throw new ConflictException(
            `주문 상품 재고량이 부족합니다. sku: ${spec.sku}, 재고량: ${spec.stock}, 주문량: ${quantity}`,
          );
        }

        await manager.decrement(
          ProductSpec,
          { id: spec.id },
          'stock',
          quantity,
        );
      }
```

### 2. 부하 테스트

#### 2-1 health test
- 대상: 테스트 API (GET / hello)
- 목적: 실제 서비스 환경(EC2)에서 동시 사용자 증가에 따른 처리 성능 한계 파악
- 테스트 툴: k6
- 모니터링: AWS CloudWatch, PM2 monit

#### 테스트 조건

- 대상 인스턴스 모델: t3.micro(EC2) 프리티어
- 시나리오: VU(가상 유저)를 점진적으로 증가시키며 응답시간과 에러율 확인

```javascript
  export const options = {
    stages: [
      { duration: "60s", target: 1000 },
      { duration: "60s", target: 1000 },
      { duration: "60s", target: 0 },
    ],
    thresholds: {
      http_req_duration: ["p(50)<200", "p(95)<250"],
      http_req_failed: ["rate<0.01"],
    },
  };
  
  export default function () {
    const response = http.get(URL);
  
    check(response, {
      ok: (r) => r.status === 200,
    });
  
    sleep(1);
  }

```

#### 결과

**개선 전**

| VU (동시 사용자) | 500 | 1000 | 1500 | 2000 |
|:---|:---:|:---:|:---:|:---:|
| 요청 성공률 | 100% | 100% | 99.79% | 99.77% |
| p50 | 13.68ms | 19.08ms | 251.11ms | 44.24ms |
| p90 | 28.71ms | 63.03ms | 507.11ms | 420.53ms |
| p95 | 60.61ms | 87.63ms | 695.98ms | 761.21ms |
| 처리량 (req/s) | 325.3 | 640.9 | 755.2 | 560.4 |
| 총 처리량 | 58522 | 115021 | 137754 | 101342 |
| 에러율 | 0% | 0% | 0.21% | 0.23% |

**개선 후**

| VU (동시 사용자) | 500 | 1000 | 1500 | 2000 |
|:---|:---:|:---:|:---:|:---:|
| 요청 성공률 | 100% | 100% | 100% | 100% |
| p50 | 13.73ms | 15.31ms | 55.55ms | 68.18ms |
| p90 | 21.51ms | 39.23ms | 150.2ms | 171.37ms |
| p95 | 30.5ms | 60.82ms | 195.05ms | 223.91ms |
| 처리량 (req/s) | 326.2 | 641.9 | 804.2 | 922.16 |
| 총 처리량 | 58999 | 115913 | 145457 | 166651 |
| 에러율 | 0% | 0% | 0% | 0% |

#### 리소스 사용량 (CloudWatch)

| VU (동시 사용자) | 500 | 1000 | 1500 | 2000 |
|:---|:---:|:---:|:---:|:---:|
| EC2 CPU 사용률 | 22.7% | 31.9% | 39.8% | 38.7% |
| EC2 NetworkIn(bytes) | 2.9M | 5.7M | 9.2M | 19.3M |
| EC2 NetworkOut(bytes) | 5.0M | 9.6M | 17.2M | 37.4M |

#### 병목 구간 분석

- **발생**: 동시 사용자가 1500명을 넘어가면서 ```Connection reset by peer``` 가 발생하여 TCP 계층에서 연결이 끊김 및 2000vu에서 처리시간은 증가하였으나 처리량이 감소하여 서버가 과부하 상태에 들어갔음을 확인
- **분석 과정**: 모니터링 결과 최대 부하 시 EC2 전체 CPU 사용량은 40% 언저리였으며 메모리 여유 공간 또한 300Mi ~ 309Mi 수준으로 하드웨어로 인한 병목 문제는 아니었음을 확인
- **원인**: EC2에서 "/var/log/nginx/error.log" 확인 결과 ```1024 worker_connections are not enough, reusing connections``` 로그가 지속적으로 찍혀있음을 확인
- **해결**: nginx 설정에서 worker_connections의 수량을 1024 -> 2048로 변경하여 각 프로세스들이 운용할 수 있는 커넥션 제한을 늘려주어 트래픽 처리 능력 향상
- **결과**: 전체적으로 응답 시간이 감소하였으며 특히, 2,000 VU 환경에서 p95 응답 시간을 761ms → 224ms로 약 71% 단축하고, 처리량을 560 req/s → 922 req/s로 약 65% 향상 시킴
- **주의 사항**: 리눅스에서 네트워크 요청은 파일로 취급되기 때문에 worker_connections를 너무 많이 늘려서 시스템이 허용하는 최대 파일 개수(ulimit)를 초과하게 된다면 ```Too many open files```오류가 발생 할 수 있고, CPU 과부하 또는 메모리 고갈로 인해 오히려 병목 현상이 나타나거나 프로세스가 다운 될 수 있으므로 자원을 고려하여 설정해야함을 확인

#### 2-2 상품 조회

- 대상: 상품 조회 API (GET / product)
- 목적: 실제 서비스 환경(EC2)에서 동시 사용자 증가에 따른 처리 성능 한계 파악
- 테스트 툴: k6
- 모니터링: AWS CloudWatch, PM2 monit

#### 테스트 조건

- 대상 인스턴스 모델: t3.micro(EC2) 프리티어, db.t4g.micro(RDS) 프리티어
- 시나리오: VU(가상 유저)를 점진적으로 증가시키며 응답시간과 에러율 확인

```javascript
  export const options = {
    stages: [
      { duration: "10s", target: 1200 },
      { duration: "60s", target: 1200 },
      { duration: "10s", target: 0 },
    ],
    thresholds: {
      http_req_duration: ["p(50)<200", "p(95)<250"],
      http_req_failed: ["rate<0.01"],
    },
  };
  
  export default function () {
    const response = http.get(URL);
  
    check(response, {
      ok: (r) => r.status === 200,
    });
  
    sleep(1);
  }

```

#### 결과

**개선 전**

| VU (동시 사용자) | 100 | 300 | 500 | 1000 |
|:---|:---:|:---:|:---:|:---:|
| 요청 성공률 | 100% | 100% | 100% | 99.83% |
| p50 | 20.94ms | 39.32ms | 370.13ms | 1.6s |
| p90 | 33.37ms | 160.69ms | 581.33ms | 2.9s |
| p95 | 52.39ms | 230.97ms | 673.44ms | 3.61s |
| 처리량 (req/s) | 83.8 | 238.4 | 316.9 | 213.3 |
| 총 처리량 | 6759 | 19280 | 25517 | 23446 |
| 에러율 | 0% | 0% | 0% | 0.17% |

**개선 후**

| VU (동시 사용자) | 100 | 300 | 500 | 1000 |
|:---|:---:|:---:|:---:|:---:|
| 요청 성공률 | 100% | 100% | 100% | 100% |
| p50 | 21.35ms | 33.01ms | 193.66ms | 1.13s |
| p90 | 30.99ms | 102.38ms | 378.09ms | 1.4s |
| p95 | 40.14ms | 140.76ms | 431.36ms | 1.63s |
| 처리량 (req/s) | 84.9 | 247.1 | 361.5 | 414.0 |
| 총 처리량 | 6859 | 20007 | 29263 | 33496 |
| 에러율 | 0% | 0% | 0% | 0% |

#### 리소스 사용량 (CloudWatch)

| VU (동시 사용자) | 100 | 300 | 500 | 1000 |
|:---|:---:|:---:|:---:|:---:|
| EC2 CPU 사용률 | 6.3% | 19.2% | 21.8% | 21.9% |
| EC2 NetworkIn(bytes) | 14.3M | 62.5M | 81.2M | 82.7M |
| EC2 NetworkOut(bytes) | 11.3M | 48.6M | 63.5M | 64.4M |
| RDS FreeableMemory | 185M | 182M | 183M | 177M |
| RDS CPU 사용률 | 5.1% | 12.1% | 14.5% | 13.3% |
| RDS Connections | 4 | 8 | 10 | 17 |


#### 병목 구간 분석

- **발생**: 동시 사용자가 1000명을 넘어가면서 요청 처리시간이 늘어나고 처리량 또한 감소하여 서버가 과부하되었음을 확인
- **분석 과정**:
 - EC2와 RDS의 metrics를 하나의 대시보드로 옮겨서 확인 한 결과 CPU와 메모리의 문제로 인한 병목은 아니었음을 확인
 - DB 커넥션풀 크기를 10 -> 20 늘려보았으나 여전히 병목 발생
 - nginx의 에러 로그에서 'Connection reset by peer'를 확인하여 k6에서 nginx까지의 요청 전달에 문제는 없었으나 nestjs에서 요청을 거절했음을 확인함
- **원인**: 여러 복합적인 이유들이 있었으나 가장 유력한 원인은 pm2 단일 프로세스 방식(fork)에선 약 1분 동안 2만 5천개의 요청을 처리하기인 무리가 있어 cpu사용률이 100%를 넘어가는 상태임을 확인
- **해결**:
  - pm2 프로세스 개수를 EC2 코어 개수(2개)에 맞춰 늘려주어 클러스터 방식으로 바꿔줌으로써 두 개의 cpu 코어가 동일한 부하를 받으며 요청을 처리함
  - EC2에서의 Accept Queue 크기는 4096인 반면 SYN Queue 크기는 128로 상대적으로 낮은 크기로 설정되어 있어 동일한 크기로 맞춰줌으로써 다수의 요청이 SYN Queue에서 대기 가능하도록 설정
  - nginx proxy 설정에서 keppalive pool 크기를 64개로 설정해주어 nginx와 nestjs서버가 통신할 때 매번 핸드셰이크 과정을 거칠 필요없이 keepalive pool에서 커넥션을 재사용하여 포트 고갈(Port Exhaustion)을 방지하고 인스턴스의 부하를 줄여줌
  - DB 커넥션풀 크기를 20 -> 30으로 추가로 늘려주고, 커넥션 timeout 설정을 5초로 설정해주어 요청이 큐에서 오랜 시간 동안 대기하는 것을 방지해줌
- **결과**: 동시 요청 기존 한계점을 1000 VU -> 2175 VU로 개선하고, 1000 VU 기준 p95 응답 시간을 3.61초 → 1.63초로 약 55% 단축했으며, 처리량을 213.3 req/s → 414.0 req/s로 약 94% 향상 시킴
- **주의 사항**: pm2 클러스터 방식으로 프로세스를 많이 띄울 수록 메모리 사용량이 증가하기 때문에 자원을 고려하여 적절하게 사용될 것이 권장됨
- **추후 개선 사항**:
  - Redis 캐싱: 상품 조회 (GET /product/id)는 수정이 적고 조회가 빈번한 API이므로 요청을 DB까지 보내지 않고 NestJs 앞단에 Redis 캐시를 두어 한 번 조회된 상품은 캐시에서 즉시 반환하도록 수정

----

## 🔨 향후 개선 계획
- [ ] 리뷰/평점 기능
- [ ] 검색 성능 최적화 (인덱싱)
- [ ] 관리자 대시보드
