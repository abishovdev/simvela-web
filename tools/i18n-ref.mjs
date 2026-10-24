// "Dostunu dəvət et" (referral) bölməsi. Qaydalar tətbiqin real qaydalarıdır:
// dost ilk alışda 10% endirim alır, dəvət edən isə dostun ilk uğurlu ödənişindən sonra 10% kupon alır.
// Kupon 6 ay etibarlıdır; promo kod və dəvət kodu birləşmir; yalnız yeni müştərilər dəvət kodundan istifadə edə bilər.
export const REF = {
  en: {
    title: 'Invite a friend, both save 10%',
    sub: 'Share your code from the app. Your friend gets 10% off their first purchase, and you get a 10% coupon after it.',
    steps: [
      ['Share your code', 'Open Profile → Invite a friend in the app and send your link or code.'],
      ['Your friend buys', 'They sign up and get 10% off their first purchase.'],
      ['You get 10% off', 'A 10% coupon for your next plan lands in your account, valid for 6 months.'],
    ],
    fine: 'For new customers on their first purchase. An invite code cannot be combined with a promo code.',
  },
  az: {
    title: 'Dostunu dəvət et, ikiniz də 10% qazanın',
    sub: 'Kodunu tətbiqdən paylaş. Dostun ilk alışda 10% endirim alır, sən isə ondan sonra 10% kupon qazanırsan.',
    steps: [
      ['Kodunu paylaş', 'Tətbiqdə Profil → Dostunu dəvət et bölməsini aç, link və ya kodu göndər.'],
      ['Dostun alış edir', 'O, qeydiyyatdan keçir və ilk alışında 10% endirim alır.'],
      ['Sən 10% qazanırsan', 'Növbəti paketin üçün 10% kupon hesabına düşür, 6 ay etibarlıdır.'],
    ],
    fine: 'Yeni müştərilər üçün, ilk alışda. Dəvət kodu promo kodla birləşdirilmir.',
  },
  tr: {
    title: 'Arkadaşını davet et, ikiniz de %10 kazanın',
    sub: 'Kodunu uygulamadan paylaş. Arkadaşın ilk alışverişinde %10 indirim alır, sen de ardından %10 kupon kazanırsın.',
    steps: [
      ['Kodunu paylaş', 'Uygulamada Profil → Arkadaşını davet et bölümünü aç, bağlantını veya kodunu gönder.'],
      ['Arkadaşın satın alır', 'Kayıt olur ve ilk alışverişinde %10 indirim alır.'],
      ['Sen %10 kazanırsın', 'Sonraki paketin için %10 kupon hesabına eklenir, 6 ay geçerlidir.'],
    ],
    fine: 'Yeni müşteriler için, ilk alışverişte geçerlidir. Davet kodu promosyon koduyla birleştirilemez.',
  },
  ru: {
    title: 'Пригласи друга, и оба получите по 10%',
    sub: 'Поделись кодом из приложения. Друг получит скидку 10% на первую покупку, а ты — купон 10% после неё.',
    steps: [
      ['Поделись кодом', 'В приложении открой Профиль → Пригласить друга и отправь ссылку или код.'],
      ['Друг покупает', 'Он регистрируется и получает скидку 10% на первую покупку.'],
      ['Ты получаешь 10%', 'Купон 10% на следующий тариф появится в аккаунте, действует 6 месяцев.'],
    ],
    fine: 'Для новых клиентов, на первую покупку. Код приглашения нельзя сочетать с промокодом.',
  },
  de: {
    title: 'Freunde einladen, beide sparen 10 %',
    sub: 'Teile deinen Code aus der App. Dein Freund erhält 10 % auf den ersten Kauf, du danach einen 10-%-Gutschein.',
    steps: [
      ['Code teilen', 'Öffne in der App Profil → Freund einladen und sende deinen Link oder Code.'],
      ['Dein Freund kauft', 'Er registriert sich und erhält 10 % Rabatt auf den ersten Kauf.'],
      ['Du sparst 10 %', 'Ein 10-%-Gutschein für deinen nächsten Tarif landet in deinem Konto, 6 Monate gültig.'],
    ],
    fine: 'Für Neukunden beim ersten Kauf. Ein Einladungscode lässt sich nicht mit einem Promo-Code kombinieren.',
  },
  fr: {
    title: 'Invitez un ami, économisez 10 % tous les deux',
    sub: 'Partagez votre code depuis l\'application. Votre ami obtient 10 % sur son premier achat, et vous un coupon de 10 % ensuite.',
    steps: [
      ['Partagez votre code', 'Dans l\'application, ouvrez Profil → Inviter un ami et envoyez votre lien ou votre code.'],
      ['Votre ami achète', 'Il s\'inscrit et obtient 10 % de réduction sur son premier achat.'],
      ['Vous gagnez 10 %', 'Un coupon de 10 % pour votre prochain forfait arrive sur votre compte, valable 6 mois.'],
    ],
    fine: 'Pour les nouveaux clients, sur le premier achat. Un code d\'invitation ne se cumule pas avec un code promo.',
  },
  it: {
    title: 'Invita un amico, risparmiate entrambi il 10%',
    sub: 'Condividi il tuo codice dall\'app. Il tuo amico ottiene il 10% sul primo acquisto e tu un coupon del 10% dopo.',
    steps: [
      ['Condividi il codice', 'Nell\'app apri Profilo → Invita un amico e invia il tuo link o codice.'],
      ['Il tuo amico acquista', 'Si registra e ottiene il 10% di sconto sul primo acquisto.'],
      ['Tu risparmi il 10%', 'Un coupon del 10% per il tuo prossimo piano arriva nel tuo account, valido 6 mesi.'],
    ],
    fine: 'Per i nuovi clienti, sul primo acquisto. Un codice invito non è cumulabile con un codice promozionale.',
  },
  es: {
    title: 'Invita a un amigo, ahorráis un 10 % los dos',
    sub: 'Comparte tu código desde la app. Tu amigo obtiene un 10 % en su primera compra y tú un cupón del 10 % después.',
    steps: [
      ['Comparte tu código', 'En la app abre Perfil → Invitar a un amigo y envía tu enlace o código.'],
      ['Tu amigo compra', 'Se registra y obtiene un 10 % de descuento en su primera compra.'],
      ['Tú ahorras un 10 %', 'Un cupón del 10 % para tu próximo plan llega a tu cuenta, válido 6 meses.'],
    ],
    fine: 'Para clientes nuevos, en la primera compra. Un código de invitación no se puede combinar con un código promocional.',
  },
  pt: {
    title: 'Convide um amigo, os dois poupam 10 %',
    sub: 'Partilhe o seu código na app. O seu amigo recebe 10 % na primeira compra e você recebe um cupão de 10 % a seguir.',
    steps: [
      ['Partilhe o código', 'Na app, abra Perfil → Convidar um amigo e envie o seu link ou código.'],
      ['O seu amigo compra', 'Regista-se e recebe 10 % de desconto na primeira compra.'],
      ['Você poupa 10 %', 'Um cupão de 10 % para o seu próximo plano chega à sua conta, válido durante 6 meses.'],
    ],
    fine: 'Para novos clientes, na primeira compra. Um código de convite não pode ser combinado com um código promocional.',
  },
  ar: {
    title: 'ادعُ صديقًا ووفّرا معًا 10%',
    sub: 'شارك رمزك من التطبيق. يحصل صديقك على خصم 10% على أول عملية شراء، وتحصل أنت على قسيمة 10% بعدها.',
    steps: [
      ['شارك رمزك', 'افتح في التطبيق الملف الشخصي ← ادعُ صديقًا وأرسل رابطك أو رمزك.'],
      ['صديقك يشتري', 'يسجّل ويحصل على خصم 10% على أول عملية شراء.'],
      ['تحصل أنت على 10%', 'تصل قسيمة 10% لباقتك التالية إلى حسابك وتبقى صالحة 6 أشهر.'],
    ],
    fine: 'للعملاء الجدد في أول عملية شراء. لا يمكن الجمع بين رمز الدعوة ورمز ترويجي.',
  },
  hi: {
    title: 'दोस्त को बुलाएँ, दोनों को 10% की बचत',
    sub: 'ऐप से अपना कोड शेयर करें। आपके दोस्त को पहली खरीद पर 10% छूट मिलती है और आपको उसके बाद 10% कूपन।',
    steps: [
      ['अपना कोड शेयर करें', 'ऐप में प्रोफ़ाइल → दोस्त को बुलाएँ खोलें और अपना लिंक या कोड भेजें।'],
      ['दोस्त खरीदता है', 'वह साइन अप करता है और पहली खरीद पर 10% छूट पाता है।'],
      ['आपको 10% मिलता है', 'आपके अगले प्लान के लिए 10% कूपन आपके खाते में आ जाता है, 6 महीने वैध।'],
    ],
    fine: 'नए ग्राहकों के लिए, पहली खरीद पर। आमंत्रण कोड को प्रोमो कोड के साथ नहीं जोड़ा जा सकता।',
  },
  ja: {
    title: '友達を招待して、2人とも10%お得に',
    sub: 'アプリからコードを共有しましょう。友達は初回購入が10%オフ、あなたはその後10%クーポンをもらえます。',
    steps: [
      ['コードを共有', 'アプリで「プロフィール → 友達を招待」を開き、リンクまたはコードを送ります。'],
      ['友達が購入', '友達は登録して、初回購入が10%オフになります。'],
      ['あなたも10%オフ', '次のプランに使える10%クーポンがアカウントに届きます。有効期間は6か月です。'],
    ],
    fine: '新規のお客様の初回購入が対象です。招待コードはプロモコードと併用できません。',
  },
  ko: {
    title: '친구를 초대하면 둘 다 10% 절약',
    sub: '앱에서 코드를 공유하세요. 친구는 첫 구매 10% 할인, 나는 그 후 10% 쿠폰을 받아요.',
    steps: [
      ['코드 공유', '앱에서 프로필 → 친구 초대를 열고 링크나 코드를 보내세요.'],
      ['친구가 구매', '친구가 가입하고 첫 구매에서 10% 할인을 받아요.'],
      ['나도 10% 할인', '다음 요금제에 쓸 10% 쿠폰이 계정에 들어오며, 6개월간 유효해요.'],
    ],
    fine: '신규 고객의 첫 구매에 적용됩니다. 초대 코드는 프로모 코드와 함께 쓸 수 없어요.',
  },
  zh: {
    title: '邀请好友，双方各省10%',
    sub: '在应用中分享你的邀请码。好友首次购买享9折，你随后获得一张10%优惠券。',
    steps: [
      ['分享邀请码', '在应用中打开“个人资料 → 邀请好友”，发送你的链接或邀请码。'],
      ['好友购买', '好友注册后，首次购买立减10%。'],
      ['你也省10%', '下次购买套餐可用的10%优惠券会发放到你的账户，有效期6个月。'],
    ],
    fine: '适用于新客户首次购买。邀请码不能与促销码同时使用。',
  },
};
