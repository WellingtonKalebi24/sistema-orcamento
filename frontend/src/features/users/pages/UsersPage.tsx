import { useEffect, useState } from "react";

import type { User } from "../../../lib/api/schema";
import { recordStatusLabels, roleLabels } from "../../../lib/formatters/labels";
import { createUser, deleteUser, listUsers, updateUser } from "../api/users.api";
import { UserForm } from "../components/UserForm";

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  function reload() {
    listUsers()
      .then(setUsers)
      .catch(() => setUsers([]));
  }

  useEffect(reload, []);

  return (
    <section className="panel">
      <p className="eyebrow">Usuarios</p>
      <h2>Perfis e acessos</h2>
      <UserForm
        onSubmit={async (input) => {
          await createUser(input);
          reload();
        }}
      />
      <div className="table-card">
        {users.map((user) => (
          <div className="table-row" key={user.id}>
            <strong>{user.name}</strong>
            <span>{user.email}</span>
            <span>{roleLabels[user.role]}</span>
            <button
              className="button-secondary"
              type="button"
              onClick={() =>
                updateUser(user.id, {
                  status: user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
                }).then(reload)
              }
            >
              {recordStatusLabels[user.status]}
            </button>
            <button
              className="button-secondary"
              type="button"
              onClick={() => deleteUser(user.id).then(reload)}
            >
              Inativar
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
