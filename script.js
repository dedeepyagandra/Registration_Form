document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/candidates');
        const candidates = await response.json();
        const candidatesList = document.getElementById('candidatesList');

        candidates.forEach(candidate => {
            const candidateItem = document.createElement('div');
            candidateItem.innerHTML = `
                <h3>${candidate.username}</h3>
                <p>Email: ${candidate.email}</p>
                <p>Country: ${candidate.country}</p>
            `;
            candidatesList.appendChild(candidateItem);
        });
    } catch (err) {
        console.error('Error fetching candidates:', err);
    }
});
