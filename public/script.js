const API_URL = 'http://localhost:3000/api'
const urlParams = new URLSearchParams(window.location.search)
const urlUserId = urlParams.get('id')

const CURRENT_USER_ID = urlUserId || ''
const isUserLoggedIn = CURRENT_USER_ID.length > 5

if (urlUserId) {
    window.history.replaceState({}, document.title, "/")
}

function switchTab(tabName) {
    const sections = document.querySelectorAll('.tab-content')
    sections.forEach(sec => sec.style.display = 'none')

    document.getElementById(`tab-${tabName}`).style.display = 'block'

    const menuItems = document.querySelectorAll('.sidebar li')
    menuItems.forEach(item => item.classList.remove('active'))

    if(tabName === 'rank') menuItems[0].classList.add('active')
    if(tabName === 'editor') menuItems[1].classList.add('active')
    if(tabName === 'commands') menuItems[2].classList.add('active')
}

// Api

async function fetchUserData() {
    if (!isUserLoggedIn) return null
    try {
        const response = await fetch(`${API_URL}/user/${CURRENT_USER_ID}`)
        if (!response.ok) throw new Error("Usuario não encontrado no banco")
            return await response.json()
    } catch (error) {
        console.error("Erro ao buscar usuario:", error)
        return null
    }
}

async function fetchLeaderboard() {
    try {
        const response = await fetch(`${API_URL}/leaderboard`)
        return await response.json()
    } catch (error) {
        console.error("Erro ao buscar ranking:", error)
        return []
    }
}

async function savePreferences() {
    if (!isUserLoggedIn) return

    const btn = document.querySelector('.save-btn')
    const originalText = btn.innerText

    btn.innerText = "Enviando pra bela... 💾"
    btn.disabled = true

    const bg = document.getElementById('bgInput').value
    const color = document.getElementById('colorInput').value

    try {
        const response = await fetch(`${API_URL}/user/${CURRENT_USER_ID}/card`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bg, color })
        })

        if (response.ok) {
            btn.innerText = "Ela gostou! Salvo! ✨"
            btn.style.background = '#2ed573'
        } else {
            throw new Error("Erro na api")
        }
    } catch (error) {
        btn.innerText = "Deu erro... Ela chorou 😭"
        btn.style.background = '#ff4757'
    }

    setTimeout(() => {
        btn.innerText = originalText
        btn.disabled = false
        btn.style.background = ""
    }, 2000)
}

// UI

function renderUser(user) {
    if (!user) return

    document.getElementById('current-user-name').innerText = user.username
    const avatar = user.avatar || 'https://i.imgur.com/AobuOcq.jpeg'
    document.getElementById('current-user-avatar').src = avatar

    document.getElementById('card-preview-name').innerText = user.username
    document.getElementById('card-preview-avatar').src = avatar
    document.getElementById('card-preview-lvl').innerText = `Level ${user.level}`
    document.getElementById('card-preview-xp').innerText = `${user.xp} / ${user.maxXp} XP`
    document.querySelector('.card-rank').innerText = `RANK #${user.rank}`
    
    document.getElementById('bgInput').value = user.preferences.bg || ''
    document.getElementById('colorInput').value = user.preferences.color || '#FF69B4'
    
    updateCard()
}

function renderLeaderboard(users) {
    const list = document.getElementById('leaderboard-list')
    list.innerHTML = ''

    if (users.length === 0) {
        list.innerHTML = '<p style="text-align:center; padding:20px;">Ainda não tem ninguém no ranking... Estou sozinha 🥺</p>'
        return
    }

    users.forEach((u, i) => {
        let posColor = "#c0c0c090"
        let posContent = `#${i + 1}`

        if(i === 0) { posColor = "#FFD700"; posContent = "🥇" }
        if(i === 1) { posColor = "#C0C0C0"; posContent = "🥈" }
        if(i === 2) { posColor = "#CD7F32"; posContent = "🥉" }

        const avatarUrl = u.avatar || 'https://i.imgur.com/AobuOcq.jpeg'

        const isBela = u.username.includes("Bela")
        const borderStyle = isBela ? "2px solid #FF69B4" : "1px solid transparent"

        list.innerHTML += `
            <div class="rank-item" style="border: ${borderStyle}">
                <div class="rank-pos" style="color: ${posColor}">
                    ${posContent}
                </div>
                <img src="${avatarUrl}" class="rank-avatar" alt="Avatar">
                <div class="rank-info">
                    <span class="rank-name">${u.username} ${isBela ? '🎀' : ''}</span>
                    <span class="rank-lvl">Level ${u.lvl} • ${u.xp} XP</span>
                </div>
                ${isBela ? '<i class="fas fa-heart" style="color:#FF69B4"></i>' : ''}
            </div>
        `
    })
}

function updateCard() {
    const bgUrl = document.getElementById('bgInput').value
    const color = document.getElementById('colorInput').value

    const cardBg = document.querySelector('.card-bg')
    const progressBar = document.getElementById('previewBar')

    if (bgUrl.length > 5) {
        cardBg.style.backgroundImage = `url('${bgUrl}')`
    } else {
        cardBg.style.backgroundImage = 'none'
        cardBg.style.backgroundColor = '#2c2f33'
    }
    progressBar.style.backgroundColor = color
    progressBar.style.boxShadow = `0 0 10px ${color}`
}

async function init() {
    const loader = document.getElementById('loading-overlay')

    const loggedArea = document.getElementById('user-logged-in')
    const loginBtn = document.getElementById('user-logged-out')
    const tabEditor = document.querySelector('li[onclick="switchTab(\'editor\')"]')

    if (isUserLoggedIn) {
        loggedArea.style.display = 'flex'
        loginBtn.style.display = 'none'
        tabEditor.style.display = 'block'

        try {
            const [user, rank] = await Promise.all([fetchUserData(), fetchLeaderboard()])

            if (user) renderUser(user)
            renderLeaderboard(rank)
        } catch (e) {
            console.error("Erro na inicialização:", e)
        }
    } else {
        loggedArea.style.display = 'none'
        loginBtn.style.display = 'block'
        tabEditor.style.display = 'none'

        const rank = await fetchLeaderboard()
        renderLeaderboard(rank)
    }

    loader.classList.add('hidden')
    setTimeout(() => loader.style.display = 'none', 500)
}

function logout() {
    alert('Saindo... tchauzinho 👋')
    location.reload()
}

const menuToggle = document.getElementById('menu-toggle')
const sidebar = document.querySelector('.sidebar')

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active')
    })
}

const sidebarItems = document.querySelectorAll('.sidebar li')
sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('active')
        }
    })
})

document.addEventListener('click', (event) => {
    if (!sidebar || !menuToggle) return
    
    const isClickInside = sidebar.contains(event.target) || menuToggle.contains(event.target)

    if (!isClickInside && sidebar.classList.contains('active') && window.innerWidth <= 768) {
        sidebar.classList.remove('active')
    }
})

init()