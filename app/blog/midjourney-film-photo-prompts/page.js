import { navCss, getNavHtml } from "../../components/navHtml";

const css = `
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css');
:root{--ink:#0a0b0b;--muted:#616670;--line:#ececf0;--paper:#fff;--soft:#f7f7f8;--purple:#5e56f0;--max:920px;--gutter:24px;--r:20px;--ls:-.02em;}
*{box-sizing:border-box} body{margin:0;font-family:"Pretendard","Noto Sans KR",system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:var(--ink);background:#fff;letter-spacing:var(--ls);line-height:1.75} a{text-decoration:none;color:inherit} code{font-family:"SFMono-Regular",Consolas,monospace}
${navCss}
.article-wrap{max-width:var(--max);margin:0 auto;padding:72px var(--gutter) 96px}.eyebrow{display:inline-flex;align-items:center;border:1px solid #e1defd;background:#f2f1ff;color:var(--purple);border-radius:999px;padding:7px 13px;font-size:13px;font-weight:800;margin-bottom:22px}.article-wrap h1{font-size:clamp(36px,6vw,62px);line-height:1.08;letter-spacing:-.06em;margin:0 0 22px;font-weight:850}.lead{font-size:19px;color:#545b66;line-height:1.8;margin:0 0 34px;max-width:760px}.meta{display:flex;gap:10px;align-items:center;color:#80858d;font-size:14px;margin-bottom:42px}.hero{width:100%;border-radius:28px;display:block;margin:0 0 48px;box-shadow:0 22px 70px rgba(0,0,0,.10);background:#f2f2f3}.article{font-size:17px}.article h2{font-size:30px;line-height:1.25;letter-spacing:-.045em;margin:58px 0 18px;padding-top:18px;border-top:1px solid var(--line)}.article h3{font-size:22px;line-height:1.35;letter-spacing:-.04em;margin:38px 0 10px}.article p{margin:0 0 18px;color:#2f3339}.article ul,.article ol{padding-left:22px;margin:0 0 22px}.article li{margin:7px 0}.note{border-left:4px solid var(--purple);background:#f7f6ff;border-radius:0 16px 16px 0;padding:18px 20px;margin:30px 0;color:#343447}.options{width:100%;border-collapse:separate;border-spacing:0;margin:20px 0 30px;border:1px solid var(--line);border-radius:18px;overflow:hidden}.options th,.options td{padding:14px 16px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}.options tr:last-child td{border-bottom:0}.options th{background:#f8f8fa;font-size:14px}.prompt-gallery{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:16px 0 18px}.prompt-gallery img{width:100%;aspect-ratio:4/5;object-fit:cover;display:block;border-radius:18px;background:#f2f2f3;box-shadow:0 12px 34px rgba(0,0,0,.08)}.prompt{background:#111114;color:#f2f2f5;border-radius:18px;padding:18px 18px;margin:14px 0 26px;overflow:auto;font-size:13px;line-height:1.7;white-space:pre-wrap}.back{display:inline-flex;margin-top:54px;color:#4f46e5;font-weight:800}.footer-space{height:40px}@media(max-width:640px){.article-wrap{padding-top:48px}.article{font-size:16px}.article h2{font-size:25px}.options{font-size:14px}.prompt-gallery{grid-template-columns:1fr;gap:10px}.prompt{font-size:12px}}
`;

export const metadata = {
  title: "미드저니 필름 사진 프롬프트 10개 | Consolve 블로그",
  description: "인스타그램 댓글 보상 링크로 제공하는 미드저니 필름 사진 프롬프트 모음입니다. 90년대 필름, 교외의 무드, 빈티지 인물 사진, 창가 정물 콘셉트를 바로 복사해 사용할 수 있습니다.",
};

const promptItems = [
  ["언덕 위 헤드셋을 쓴 남자와 누워 있는 강아지", "조용한 교외의 언덕, 헤드셋을 쓴 남자, 옆에 누워 있는 강아지. 90년대 필름 스냅처럼 사적인 순간을 만들고 싶을 때 좋습니다.", "90s candid Kodak film photograph of a man wearing a headset lying on a grassy hill beside a lying dog, quiet suburban ennui, intimate found-footage feeling, Diana F camera aesthetic, Provia film color, soft halogen lighting, imperfect focus, natural grain, nostalgic everyday scene --ar 4:5 --style raw --v 6.1", "headset-hill-dog"],
  ["밤 안개 숲에 앉아 있는 두 사람", "로맨스 영화의 장면처럼 보이되, 특정 작품명이나 캐릭터명 없이 사용할 수 있게 정리한 버전입니다.", "cinematic screencap-style photograph of two pale young lovers sitting on wet grass in a nighttime foggy forest, one wearing a gray jacket, quiet romantic tension, mist between dark trees, soft moonlit haze, muted blue and green palette, vintage romance movie still, subtle film grain, natural pose --ar 16:9 --style raw --v 6.1", "foggy-forest-lovers"],
  ["교외의 소녀들, 90년대 필름 스냅", "친구들끼리 아무렇게나 찍힌 듯한 장면을 만들 때 좋습니다. 너무 패션 화보처럼 보이지 않게 candid, found footage를 유지하는 것이 핵심입니다.", "90s candid Kodak film photograph of a small group of girls in a quiet suburban neighborhood, casual vintage outfits, understated expressions, suburban ennui, Diana F found-footage photo, Provia film color, halogen lighting, soft grain, imperfect framing, nostalgic slice of life --ar 4:5 --style raw --v 6.1", "suburban-girls"],
  ["황혼 하늘 아래 헤드폰을 낀 실루엣", "음악에 빠져 있는 고독한 인물 이미지를 만들 때 쓰기 좋습니다.", "90s candid Kodak film photograph of the silhouette of a person wearing headphones sitting quietly under a twilight sky, lost in music, cinematic mood, suburban ennui, Diana F found-footage aesthetic, Provia film, soft halogen glow, gentle grain, quiet negative space, melancholic atmosphere --ar 4:5 --style raw --v 6.1", "headphones-twilight-silhouette"],
  ["창가, 꽃병, 녹음기가 있는 미니멀 정물", "인물 없이도 감성적인 피드 이미지를 만들고 싶을 때 사용할 수 있는 정물 프롬프트입니다.", "elegant minimalist window scene, sunlight casting gentle shadows on the wall and curtains, a vase filled with flowers beside the window, a small sound recorder on the table, soft blue sky visible through the glass, quiet interior photography, natural morning light, muted colors, delicate film grain, calm editorial mood --ar 4:5 --style raw --v 6.1", "minimalist-window-recorder"],
  ["지하철 안의 남자, 빈티지 필름 컷", "도시의 피로감, 이동 중의 고독, 90년대 스냅 분위기를 만들 때 좋습니다.", "90s candid Kodak film photograph of a man sitting alone in a subway car, quiet expression, old train interior, suburban ennui in the city, Diana F found-footage photo, Provia film color, halogen lighting, motion blur, imperfect focus, natural grain, cinematic loneliness --ar 4:5 --style raw --v 6.1", "subway-man"],
  ["황혼 하늘만 담은 필름 사진", "배경 이미지, 릴스 커버, 카드뉴스 첫 장의 무드 컷으로 쓰기 좋습니다.", "90s candid Kodak film photograph of a twilight sky over a quiet suburban street, soft clouds, fading blue and lavender light, suburban ennui, Diana F found-footage aesthetic, Provia film color, halogen warmth from distant windows, film grain, nostalgic empty atmosphere --ar 4:5 --style raw --v 6.1", "twilight-sky"],
  ["교외의 소년, 조용한 빈티지 초상", "강한 포즈보다 자연스러운 표정과 어긋난 프레이밍이 더 잘 어울리는 프롬프트입니다.", "90s candid Kodak film photograph of a boy standing in a quiet suburban setting, casual old outfit, understated expression, suburban ennui, Diana F found-footage photo, Provia film color, soft halogen lighting, imperfect framing, gentle grain, nostalgic portrait, real everyday moment --ar 4:5 --style raw --v 6.1", "suburban-boy"],
  ["빗속에서 춤추는 커플", "조금 더 드라마틱한 장면이 필요할 때 사용할 수 있습니다. candid와 found footage를 넣어 과한 광고 사진처럼 보이는 것을 줄였습니다.", "90s candid Kodak film photograph of a couple dancing in the rain on a quiet suburban street, wet pavement reflecting street lights, intimate spontaneous movement, suburban ennui, Diana F found-footage aesthetic, Provia film color, halogen lighting, soft motion blur, nostalgic romantic mood --ar 4:5 --style raw --v 6.1", "couple-dancing-rain"],
  ["워크맨과 헤드폰을 든 80s/90s 스트리트 포트레이트", "빈티지 음악 감성, 카세트 플레이어, 터틀넥, 오래된 재킷 같은 요소를 한 번에 넣은 프롬프트입니다.", "80s and 90s aesthetic street light photography pose, person wearing headphones with a Walkman CD player and cassette details, old jacket, beige turtleneck, vintage outfit, quiet nighttime street, suburban ennui, Diana F found-footage photo, warm halogen light, Provia film color, imperfect focus, natural grain, nostalgic music portrait --ar 4:5 --style raw --v 6.1", "walkman-street-portrait"],
];

export default function MidjourneyFilmPhotoPromptsPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div dangerouslySetInnerHTML={{ __html: getNavHtml("blog") }} />
      <main className="article-wrap">
        <span className="eyebrow">댓글 보상 자료</span>
        <h1>미드저니 필름 사진 프롬프트 10개: 댓글 보상용 복사본</h1>
        <p className="lead">90년대 필름 사진, 교외의 쓸쓸한 분위기, 빈티지 헤드폰과 워크맨, 흐린 숲과 창가 정물 같은 이미지를 만들기 위한 미드저니용 문장입니다.</p>
        <div className="meta"><b>Consolve</b><span>·</span><span>2026년 6월 23일</span></div>
        <img className="hero" src="/generated-content/midjourney-film-photo-prompts/hero.png" alt="미드저니 필름 사진 프롬프트 대표 이미지" />
        <article className="article">
          <p>각 프롬프트는 그대로 복사해서 사용할 수 있고, 필요하면 주인공·장소·시간대만 바꿔도 비슷한 톤의 이미지를 만들 수 있습니다. 결과를 더 안정적으로 맞추고 싶다면 마지막에 <code>--ar 4:5 --style raw --v 6.1</code> 같은 비율과 버전 옵션을 붙여 사용하세요.</p>
          <p className="note">공개 블로그에서는 특정 영화·캐릭터 이름을 그대로 호출하기보다 분위기와 장면 언어로 바꿔 쓰는 편이 안전합니다. 아래 문장은 바로 사용하기 좋게 일부 표현을 일반화했습니다.</p>
          <h2>추천 사용 옵션</h2>
          <table className="options"><tbody>
            <tr><th>목적</th><th>옵션 예시</th></tr>
            <tr><td>인스타 피드 세로 이미지</td><td><code>--ar 4:5 --style raw --v 6.1</code></td></tr>
            <tr><td>스토리/릴스 커버</td><td><code>--ar 9:16 --style raw --v 6.1</code></td></tr>
            <tr><td>영화 스틸 느낌</td><td><code>--ar 16:9 --style raw --v 6.1</code></td></tr>
            <tr><td>더 거친 필름 질감</td><td><code>film grain, dust, halation, imperfect focus</code> 추가</td></tr>
            <tr><td>더 조용한 무드</td><td><code>suburban ennui, muted color palette, soft dusk light</code> 추가</td></tr>
          </tbody></table>
          <h2>필름 사진 프롬프트 10개</h2>
          {promptItems.map(([title, desc, prompt, imageBase], index) => (
            <section key={title}>
              <h3>{index + 1}. {title}</h3>
              <p>{desc}</p>
              <div className="prompt-gallery" aria-label={`${title} 이미지 예시 3장`}>
                {[1, 2, 3].map((variant) => (
                  <img
                    key={variant}
                    src={`/generated-content/midjourney-film-photo-prompts/${imageBase}-0${variant}.png`}
                    alt={`${title} ${variant}`}
                    loading={index < 2 ? "eager" : "lazy"}
                  />
                ))}
              </div>
              <pre className="prompt"><code>{prompt}</code></pre>
            </section>
          ))}
          <h2>프롬프트를 바꿔 쓰는 방법</h2>
          <p>위 문장을 그대로 사용해도 되지만, 같은 스타일로 다른 이미지를 만들고 싶다면 아래 세 부분만 바꿔보세요.</p>
          <ol>
            <li><b>주인공</b>: a man, a girl, a couple, a silhouette, a dog</li>
            <li><b>장소</b>: suburban street, grassy hill, subway car, foggy forest, minimalist window scene</li>
            <li><b>시간과 빛</b>: twilight sky, nighttime fog, soft halogen lighting, gentle sunlight, street light</li>
          </ol>
          <pre className="prompt"><code>{"90s candid Kodak film photograph of a girl sitting alone at an early morning bus stop, quiet suburban street, headphones around her neck, suburban ennui, Diana F found-footage photo, Provia film color, soft halogen lighting, imperfect focus, natural grain --ar 4:5 --style raw --v 6.1"}</code></pre>
          <h2>더 좋은 결과를 위한 체크리스트</h2>
          <ul>
            <li>같은 프롬프트를 한 번만 돌리지 말고 3~5회 반복해서 고르세요.</li>
            <li>인물의 표정이 너무 모델처럼 나오면 <code>ordinary person</code>, <code>unposed</code>, <code>imperfect framing</code>을 추가하세요.</li>
            <li>색감이 너무 선명하면 <code>muted color palette</code>, <code>faded film color</code>를 추가하세요.</li>
            <li>사진이 너무 깨끗하면 <code>film grain</code>, <code>dust</code>, <code>slightly underexposed</code>를 추가하세요.</li>
            <li>장면이 너무 복잡하면 배경 요소를 줄이고 장소·빛·감정만 남기세요.</li>
          </ul>
          <p>필요한 프롬프트를 복사해서 쓰고, 마음에 드는 결과가 나오면 같은 문장 안에서 인물·장소·시간대만 조금씩 바꿔보세요.</p>
          <a className="back" href="/blog">← 블로그 목록으로</a>
        </article>
      </main>
      <div className="footer-space" />
    </>
  );
}
