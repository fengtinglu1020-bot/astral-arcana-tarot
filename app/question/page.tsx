"use client";

import { FormEvent, useState } from "react";
import { ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { ReadingProgress } from "@/components/reading-progress";
import { saveQuestion } from "@/lib/reading-storage";

export default function QuestionPage() {
  const [question, setQuestion] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    const clean = question.trim();
    if (clean.length < 8) {
      setError("Please write a little more so the reading has something meaningful to explore.");
      return;
    }
    saveQuestion(clean);
    window.location.assign("/spread");
  }

  return (
    <SiteShell>
      <main className="flow-page">
        <ReadingProgress current={1} />
        <section className="flow-panel narrow-panel">
          <div className="eyebrow"><span>✦</span> Step one <span>✦</span></div>
          <h1>What would you like<br />the cards to <em>illuminate?</em></h1>
          <p className="section-lead">A focused, open-ended question creates the most useful reading.</p>
          <form onSubmit={submit} className="question-form">
            <label htmlFor="question">Your question</label>
            <textarea
              id="question"
              value={question}
              maxLength={240}
              onChange={(event) => { setQuestion(event.target.value); setError(""); }}
              placeholder="What should I understand about the direction of my current path?"
              rows={5}
              autoFocus
            />
            <div className="field-meta"><span>{question.length}/240</span><span>Keep private details out of your question.</span></div>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="button button-primary button-wide" type="submit">Choose a spread <ArrowRight size={17} /></button>
          </form>
        </section>
      </main>
    </SiteShell>
  );
}
