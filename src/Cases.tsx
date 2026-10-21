"use client";

import { USE_CASES } from "./usecases";

export function Cases() {
  return (
    <section style={{ maxWidth: 760, margin: "0 auto", padding: "1.5rem 1.2rem 3rem", fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <h2>Queries and unsigned transactions</h2>
      <p>
        Built here, not sent. A transaction has authorizations and no signatures. Where this feature has no
        action of its own, the query is the chain example.
      </p>
      {USE_CASES.map((item) => (
        <article key={item.title}>
          <h3>{item.title}</h3>
          <p>{item.detail}</p>
          <p>
            <code>{item.request.method}</code> {item.request.url}
          </p>
          {item.request.body ? (
            <pre style={{ overflow: "auto" }}>
              <code>{JSON.stringify(item.request.body, null, 2)}</code>
            </pre>
          ) : null}
          {item.transaction ? (
            <>
              <p>{item.transaction.note}</p>
              <pre style={{ overflow: "auto" }}>
                <code>{JSON.stringify(item.transaction.actions, null, 2)}</code>
              </pre>
            </>
          ) : (
            <p>No transaction. This use case does not invent an action.</p>
          )}
        </article>
      ))}
    </section>
  );
}
