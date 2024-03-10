const token = ""; //輸入要殺人帳號的token


function wait(ms) {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
};
function delay(ms) {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
};

function getPlayerId(playerName) {
    return fetch('https://api.swordgale.online/api/players', {
        method: 'GET',
        'headers': {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0',
          'token': token
      }
    })
    .then(response => {
        if (!response) {
            throw new Error('無法從 API 端點獲取數據');
        }
        if (!response.ok) {
            throw new Error('獲取玩家列表 API 請求失敗');
        }
        return response.json();
    })
    .then(data => {
        if (!Array.isArray(data.players)) {
            console.error('API 返回的數據不是預期的格式', data);
            throw new Error('API 返回的數據不是預期的格式');
        }
        const players = data.players;
        const foundPlayer = players.find(player => player.nickname === playerName);
        return foundPlayer ? foundPlayer.id : null;
    })
    .catch(error => {
        console.error(`獲取玩家 ${playerName} ID 時發生錯誤:`, error);
        return null;
    });
}

function searchPlayersAndAttack(playerNames) {
    playerNames.forEach(playerName => {
        attackPlayer(playerName);
    });
}

async function attackPlayer(playerName) {
    try {
        const playerId = await getPlayerId(playerName);
        if (playerId) {
            const attackUrl = `https://api.swordgale.online/api/player/${playerId}/attack/2`;
            const formData = {
                'type': '1'
            };
            const options = {
                'method': 'post',
                'body': JSON.stringify(formData),
                'headers': {
                  'Content-Type': 'application/json',
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0',
                  'token': token
              }
            };

            const response = await fetch(attackUrl, options);
            if (!response.ok) {
                throw new Error('攻擊 API 請求失敗');
            }
            const data = await response.json();
            console.log(`成功攻擊玩家，ID: ${playerId}`);
            // 在攻擊成功後可以執行其他操作
        } else {
            console.log(`未找到玩家 ${playerName}`);
        }
    } catch (error) {
        console.error('攻擊 API 錯誤:', error);
    }
}

// 您想搜尋的玩家名字列表
const playerNames = ['',''];

// 每3秒搜尋一次並攻擊列表中的玩家
setInterval(() => {
    searchPlayersAndAttack(playerNames);
}, 9000);





