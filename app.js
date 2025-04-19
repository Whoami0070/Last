// Ваш Project ID из WalletConnect
const projectId = '7dabcdde47b6439403c2ec186b1fedaf';

let provider;
let walletConnected = false;

const connectButton = document.getElementById('connect-wallet');
const approveButton = document.getElementById('approve-tokens');

// Создание нового экземпляра WalletConnect
const createWalletConnectProvider = () => {
  provider = new WalletConnectProvider({
    rpc: {
      1: "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID"
    },
    qrcodeModalOptions: {
      mobileLinks: ["trust", "metamask"]
    }
  });

  provider.on("accountsChanged", (accounts) => {
    console.log("Accounts changed: ", accounts);
    walletConnected = true;
    approveButton.style.display = 'block'; // Показать кнопку для подтверждения
  });

  provider.on("chainChanged", (chainId) => {
    console.log("Chain changed to: ", chainId);
  });

  provider.on("disconnect", (code, reason) => {
    console.log("Disconnected: ", code, reason);
    walletConnected = false;
    approveButton.style.display = 'none'; // Скрыть кнопку
  });
};

// Подключение кошелька
connectButton.addEventListener('click', async () => {
  if (!walletConnected) {
    await createWalletConnectProvider();
    await provider.enable();  // Подключение и запуск WalletConnect
    console.log('Connected wallet:', provider.accounts);
  }
});

// Подтверждение всех токенов (пример взаимодействия с контрактом)
approveButton.addEventListener('click', async () => {
  if (walletConnected) {
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    const address = await signer.getAddress();

    console.log("Подтверждаем транзакцию для:", address);

    // Пример: отправка эфира (можно адаптировать под подтверждение токенов)
    const tx = await signer.sendTransaction({
      to: address, 
      value: ethers.utils.parseEther("0.01"), // Пример перевода эфира
    });

    console.log('Transaction hash:', tx.hash);
    await tx.wait();
    alert('Транзакция подтверждена!');
  }
});