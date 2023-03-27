// Profile information
const overview = document.querySelector(".overview");
// GitHub username
const username = "DeniseLewis1";
// List of repos
const repoList = document.querySelector(".repo-list");
// Section with class of repos
const reposSection = document.querySelector(".repos");
// Section with class of repo-data
const repoData = document.querySelector(".repo-data");
// Back to Repo Gallery button
const backButton = document.querySelector(".view-repos");
// Search box input
const filterInput = document.querySelector(".filter-repos");

// Fetch GitHub profile
const getUserInfo = async function () {
    const fetchUserInfo = await fetch(`https://api.github.com/users/${username}`);
    const userInfo = await fetchUserInfo.json();
    displayUserInfo(userInfo);
};

getUserInfo();

// Fetch and display user information
const displayUserInfo = function (data) {
    const div = document.createElement("div");
    div.classList.add("user-info");
    div.innerHTML = `
        <figure>
            <img alt="user avatar" src=${data.avatar_url} />
        </figure>
        <div>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Bio:</strong> ${data.bio}</p>
            <p><strong>Location:</strong> ${data.location}</p>
            <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
        </div>
        `;
    overview.append(div);
    getRepos();
};

// Fetch repo information
const getRepos = async function () {
    const fetchRepoData = await fetch(`https://api.github.com/users/${username}/repos?sort=udpated&per_page=100`);
    const repoData = await fetchRepoData.json();
    displayRepos(repoData);
};

// Display repo information
const displayRepos = function (repos) {
    filterInput.classList.remove("hide");

    for (let repo of repos) {
        let li = document.createElement("li");
        li.classList.add("repo");
        li.innerHTML = `<h3>${repo.name}</h3>`;
        repoList.append(li);
    }
};

// Fetch and display specific repo information
repoList.addEventListener("click", function (e) {
    if (e.target.matches("h3")) {
        let repoName = e.target.innerText;
        getRepoInfo(repoName);
    }
});

// Fetch specific repo information
const getRepoInfo = async function (repoName) {
    const fetchRepoInfo = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
    const repoInfo = await fetchRepoInfo.json();

    const fetchLanguages = await fetch(repoInfo.languages_url);
    const languageData = await fetchLanguages.json();

    const languages = [];
    for (let language in languageData) {
        languages.push(language);
    }
    
    displayRepoInfo(repoInfo, languages);
};

// Display specific repo information
const displayRepoInfo = function (repoInfo, languages) {
    repoData.innerHTML = "";
    let div = document.createElement("div");
    div.innerHTML = `
        <h3>Name: ${repoInfo.name}</h3>
            <p>Description: ${repoInfo.description}</p>
            <p>Default Branch: ${repoInfo.default_branch}</p>
            <p>Languages: ${languages.join(", ")}</p>
            <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
        `;
    repoData.append(div);
    repoData.classList.remove("hide");
    reposSection.classList.add("hide");
    backButton.classList.remove("hide");
};

// Back to Repo Gallery button clicked
backButton.addEventListener("click", function () {
    reposSection.classList.remove("hide");
    repoData.classList.add("hide");
    backButton.classList.add("hide");
});

// Filter repos by search box input
filterInput.addEventListener("input", function (e) {
    const input = e.target.value;
    const repos = document.querySelectorAll(".repo");
    const inputLower = input.toLowerCase();

    for (let repo of repos) {
        let repoLower = repo.innerText.toLowerCase();
        if (repoLower.includes(inputLower)) {
            repo.classList.remove("hide");
        } else {
            repo.classList.add("hide");
        }
    }
});