document.addEventListener('DOMContentLoaded', () => {
    Ecos.shell('Login', '');
    Ecos.footer();

    if (Ecos.getCurrentUser()) {
        location.href = 'painel.html';
        return;
    }

    document.getElementById('app').innerHTML = `
        <div class="page">
            <div class="panel auth">
                <div class="kicker">HUNTER ASSOCIATION</div>

                <h2>Acesso ao sistema</h2>

                <p>Entre com seu usuário e senha.</p>

                <p id="error" class="erro" hidden></p>

                <form id="loginForm">
                    <label>Usuário</label>
                    <input
                        id="usuario"
                        required
                        autofocus
                        autocomplete="username"
                    >

                    <label>Senha</label>
                    <input
                        id="senha"
                        type="password"
                        required
                        autocomplete="current-password"
                    >

                    <div class="actions">
                        <button class="btn" type="submit">
                            ENTRAR
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document
        .getElementById('loginForm')
        .addEventListener('submit', async e => {
            e.preventDefault();

            const usuario = document
                .getElementById('usuario')
                .value
                .trim();

            const senha = document.getElementById('senha').value;

            const db = Ecos.loadDB();
            const found = db.usuarios.find(
                x => x.usuario === usuario
            );

            if (!found) {
                return fail();
            }

            const hash = await Ecos.hashPassword(senha);

            if (hash !== found.senha) {
                return fail();
            }

            Ecos.setCurrentUser(found);
            location.href = 'painel.html';
        });

    function fail() {
        const error = document.getElementById('error');

        error.textContent = 'Credenciais inválidas.';
        error.hidden = false;
    }
});
