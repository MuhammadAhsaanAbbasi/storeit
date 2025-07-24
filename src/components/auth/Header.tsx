
interface HeaderProps {
    label: string;
};

export const AuthHeader = ({
    label,
}: HeaderProps) => {
    return (
        <div className="w-full">
            <h1 className="form-title">
                {label}
            </h1>
        </div>
    );
};