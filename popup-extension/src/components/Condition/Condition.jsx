const Condition = ({ ruleId, condition }) => {
    return (
        <div>
            <span>IF REQUEST URL CONTAINS {condition.url} REDIRECT TO {condition.redirect} </span>
        </div>
    )
}

export default Condition;